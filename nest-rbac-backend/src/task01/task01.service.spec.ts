import { Test, TestingModule } from '@nestjs/testing';
import { Task01Service } from './task01.service';

describe('Task01Service', () => {
  let service: Task01Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Task01Service],
    }).compile();

    service = module.get<Task01Service>(Task01Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
