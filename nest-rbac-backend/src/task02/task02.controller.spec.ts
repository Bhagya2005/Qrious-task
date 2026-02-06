import { Test, TestingModule } from '@nestjs/testing';
import { Task02Controller } from './task02.controller';
import { Task02Service } from './task02.service';

describe('Task02Controller', () => {
  let controller: Task02Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Task02Controller],
      providers: [Task02Service],
    }).compile();

    controller = module.get<Task02Controller>(Task02Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
