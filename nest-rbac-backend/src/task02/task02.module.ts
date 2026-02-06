import { Module } from '@nestjs/common';
import { Task02Service } from './task02.service';
import { Task02Controller } from './task02.controller';

@Module({
  controllers: [Task02Controller],
  providers: [Task02Service],
})
export class Task02Module {}
