import { Injectable } from '@nestjs/common';
import { CreateModItemAssignmentDto } from './dto/create-mod_item_assignment.dto';
import { UpdateModItemAssignmentDto } from './dto/update-mod_item_assignment.dto';

@Injectable()
export class ModItemAssignmentService {
  create(createModItemAssignmentDto: CreateModItemAssignmentDto) {
    return 'This action adds a new modItemAssignment';
  }

  findAll() {
    return `This action returns all modItemAssignment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} modItemAssignment`;
  }

  update(id: number, updateModItemAssignmentDto: UpdateModItemAssignmentDto) {
    return `This action updates a #${id} modItemAssignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} modItemAssignment`;
  }
}
