import { Test, TestingModule } from '@nestjs/testing';
import { Task02Service } from './task02.service';

describe('Task02Service', () => {
  let service: Task02Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Task02Service],
    }).compile();

    service = module.get<Task02Service>(Task02Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
