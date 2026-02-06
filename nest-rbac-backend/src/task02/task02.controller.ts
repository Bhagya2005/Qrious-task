import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Task02Service } from './task02.service';
import { CreateTask02Dto } from './dto/create-task02.dto';
import { UpdateTask02Dto } from './dto/update-task02.dto';

@Controller('task02')
export class Task02Controller {
  constructor(private readonly task02Service: Task02Service) {}

  @Post()
  create(@Body() createTask02Dto: CreateTask02Dto) {
    return this.task02Service.create(createTask02Dto);
  }

  @Get()
  findAll() {
    return this.task02Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.task02Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTask02Dto: UpdateTask02Dto) {
    return this.task02Service.update(+id, updateTask02Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.task02Service.remove(+id);
  }
}
