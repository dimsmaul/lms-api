import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { isEmail } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MinioService } from 'src/minio/minio.service';
import { RefreshToken } from './entities/refresh_token.entity';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    private minioService: MinioService,

    @Inject('JWT_ACCESS_SERVICE')
    private jwtAccessService: JwtService,

    @Inject('JWT_REFRESH_SERVICE')
    private jwtRefreshService: JwtService,
  ) {}

  async signin(signInDto: SignInDto) {
    var useemail = false;
    const { identifier, password } = signInDto;

    if (isEmail(identifier)) {
      useemail = true;
    }

    const user = await this.userRepository.findOne({
      where: useemail
        ? {
            email: identifier,
          }
        : {
            username: identifier,
          },
    });

    if (!user) throw new UnauthorizedException('Invalid Credentials');
    if (!user.isActive) throw new UnauthorizedException('Invalid Credentials');

    const compare = await bcrypt.compare(password, user?.password);

    if (!compare) throw new UnauthorizedException('Invalid Credentials');
    const payload = { sub: user.id };

    const token = this.jwtAccessService.sign(payload);
    const refresh = this.jwtRefreshService.sign(payload);

    // insert refresh token into db

    //  validate user allow multi device or not
    const findUserRefreshTokens = await this.refreshTokenRepository.find({
      where: { user: { id: user.id } },
    });

    if (findUserRefreshTokens.length > 1 && !user.allowMultipleDevices) {
      throw new UnauthorizedException(
        'You are not allowed to login from multiple devices',
      );
    }

    if (findUserRefreshTokens.length < 1 || user.allowMultipleDevices) {
      // create token
      // console.log('Creating refresh token for user:', user.id);
      const refreshToken = this.refreshTokenRepository.create({
        token: refresh,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        user: user,
      });
      await this.refreshTokenRepository.save(refreshToken);
    }

    // TODO: Assign cookies in frontend

    const profilepict = await this.minioService.getSignedUrl(
      user.profilePicture,
      3600 * 1,
    );

    return {
      token,
      refresh,
      data: {
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          profile: profilepict,
          isSuperAdmin: user.isSuperAdmin,
          isAllowedToCreateCourse: user.isAllowedToCreateCourse,
        },
      },
    };
  }

  async signup(signUpDto: SignUpDto) {
    const { email, firstName, lastName, password } = signUpDto;

    // check duplicate email or not
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = this.userRepository.create({
      email,
      firstName,
      lastName,
      password,
    });

    await this.userRepository.save(user);

    // TODO: Send welcome email

    // await this.mailService.sendWelcomeEmail(user.email);

    return { message: 'User registered successfully' };
  }

  async getUserFromRequest(token: string) {
    if (!token) throw new UnauthorizedException('No token provided');

    const payload = this.jwtAccessService.verify(token);
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ResponseUserDto,
    });
    if (!user) throw new UnauthorizedException('User not found');

    const profilePicture = await this.minioService.getSignedUrl(
      user.profilePicture,
      3600 * 1,
    );

    return {
      ...user,
      profile: profilePicture,
    };
  }

  async refresh(incomingRefreshToken: string) {
    if (!incomingRefreshToken)
      throw new UnauthorizedException('No refresh token provided');

    // verify refresh token
    const payload = this.jwtRefreshService.verify(incomingRefreshToken);

    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException('User not found');

    // cek token masih valid di DB
    const storedToken = await this.refreshTokenRepository.findOne({
      // where: { token: incomingRefreshToken },
      where: { token: incomingRefreshToken, user: { id: user.id } },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // cek expired
    if (storedToken.expiresAt.getTime() < Date.now()) {
      await this.refreshTokenRepository.remove(storedToken);
      throw new UnauthorizedException('Refresh token expired');
    }
    const newpayload = { sub: user.id };

    // generate new access token
    const newAccess = this.jwtAccessService.sign(newpayload);

    return { accessToken: newAccess };
  }

  async logout(incomingRefreshToken: string) {
    if (!incomingRefreshToken)
      throw new UnauthorizedException('No refresh token provided');

    try {
      // verify refresh token
      const payload = this.jwtRefreshService.verify(incomingRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) throw new UnauthorizedException('User not found');

      // cek token masih valid di DB
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { token: incomingRefreshToken, user: { id: user.id } },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // remove refresh token
      await this.refreshTokenRepository.remove(storedToken);

      return { message: 'Logout successful' };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
