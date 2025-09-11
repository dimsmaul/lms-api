import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import express from 'express';
import { AuthGuard } from './auth.guard';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @UsePipes(new ValidationPipe())
  async signin(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { token, refresh, data } =
      await this.authService.signin(signInDto);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true, // aktifkan kalau sudah pakai https
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15, // 15 menit
    });

    res.cookie('refresh_token', refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'strict', // Adjust based on your requirements
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days)
    });

    return {
      message: 'Sign-in successful',
      data,
    };
  }

  @Post('sign-up')
  @UsePipes(new ValidationPipe())
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @Post('refresh')
  async refresh(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    const { accessToken } = await this.authService.refresh(refreshToken);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true, // aktifkan kalau sudah pakai https
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15, // 15 menit
    });

    // res.cookie('refresh_token', refresh, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production', // Set to true in production
    //   sameSite: 'strict', // Adjust based on your requirements
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days)
    // });

    return { message: 'Token refreshed' };
  }

  @Post('/me')
  @UseGuards(AuthGuard)
  async me(@Req() req: express.Request) {
    const token = req.cookies['access_token'];
    const user = await this.authService.getUserFromRequest(token);
    return { user };
  }

  @Post('logout')
  async logout(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    await this.authService.logout(req.cookies['refresh_token']);
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0,
    });

    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
    });

    return { message: 'Logout successful' };
  }

  // @Post()
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
