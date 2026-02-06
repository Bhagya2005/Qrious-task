import { Test, TestingModule } from '@nestjs/testing';
import { Task01Controller } from './task01.controller';

describe('Task01Controller', () => {
  let controller: Task01Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Task01Controller],
    }).compile();

    controller = module.get<Task01Controller>(Task01Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
