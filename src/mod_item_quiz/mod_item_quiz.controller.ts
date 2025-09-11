import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModItemQuizService } from './mod_item_quiz.service';
import { CreateModItemQuizDto } from './dto/create-mod_item_quiz.dto';
import { UpdateModItemQuizDto } from './dto/update-mod_item_quiz.dto';

@Controller('mod-item-quiz')
export class ModItemQuizController {
  constructor(private readonly modItemQuizService: ModItemQuizService) {}

  @Post()
  create(@Body() createModItemQuizDto: CreateModItemQuizDto) {
    return this.modItemQuizService.create(createModItemQuizDto);
  }

  @Get()
  findAll() {
    return this.modItemQuizService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modItemQuizService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModItemQuizDto: UpdateModItemQuizDto) {
    return this.modItemQuizService.update(+id, updateModItemQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modItemQuizService.remove(+id);
  }
}
