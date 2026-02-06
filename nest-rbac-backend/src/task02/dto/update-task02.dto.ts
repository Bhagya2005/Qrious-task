import { PartialType } from '@nestjs/swagger';
import { CreateTask02Dto } from './create-task02.dto';

export class UpdateTask02Dto extends PartialType(CreateTask02Dto) {}
