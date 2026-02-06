import { Injectable } from '@nestjs/common';
import { task01Dto } from './dto/task01.dto';

@Injectable()
export class Task01Service {
sol(data: task01Dto) {
  let emp = 0, salary = 0, depth = 0;
  console.log(data);
  console.log(data.subordinates);
  console.log(data.salary)


  function go(person: task01Dto, level: number) {
    emp++;
    salary += person.salary;
    // depth = level;
    depth = Math.max(depth, level); 

    for (let p of person.subordinates) {
      go(p, level + 1);
    }
  }
  
  go(data, 1);

  return {
    total_employees: emp,
    total_salary: salary,
    max_depth: depth,
  };
}
}

