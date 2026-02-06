import { Module } from '@nestjs/common';
import { Task01Controller } from './task01.controller';
import { Task01Service } from './task01.service';

@Module({
  controllers: [Task01Controller],
  providers: [Task01Service]
})
export class Task01Module {}
