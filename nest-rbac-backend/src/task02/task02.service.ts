import { Injectable } from '@nestjs/common';
import { CreateTask02Dto } from './dto/create-task02.dto';
import { UpdateTask02Dto } from './dto/update-task02.dto';

@Injectable()
export class Task02Service {
  create(createTask02Dto: CreateTask02Dto) {
    return 'This action adds a new task02';
  }

  findAll() {
    return `This action returns all task02`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task02`;
  }

  update(id: number, updateTask02Dto: UpdateTask02Dto) {
    return `This action updates a #${id} task02`;
  }

  remove(id: number) {
    return `This action removes a #${id} task02`;
  }
}
