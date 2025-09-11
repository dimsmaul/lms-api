import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModItemAssignmentService } from './mod_item_assignment.service';
import { CreateModItemAssignmentDto } from './dto/create-mod_item_assignment.dto';
import { UpdateModItemAssignmentDto } from './dto/update-mod_item_assignment.dto';

@Controller('mod-item-assignment')
export class ModItemAssignmentController {
  constructor(private readonly modItemAssignmentService: ModItemAssignmentService) {}

  @Post()
  create(@Body() createModItemAssignmentDto: CreateModItemAssignmentDto) {
    return this.modItemAssignmentService.create(createModItemAssignmentDto);
  }

  @Get()
  findAll() {
    return this.modItemAssignmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modItemAssignmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModItemAssignmentDto: UpdateModItemAssignmentDto) {
    return this.modItemAssignmentService.update(+id, updateModItemAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modItemAssignmentService.remove(+id);
  }
}
