import { Body, Controller, Post } from '@nestjs/common';
import { Task01Service } from './task01.service';
import { task01Dto } from './dto/task01.dto';

@Controller('task01')
export class Task01Controller {
  constructor(private readonly Task01Service: Task01Service) {}

  @Post()
  calculate(@Body() employeeDto: task01Dto) {
    return this.Task01Service.sol(employeeDto);
  }

}
