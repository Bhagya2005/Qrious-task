import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'RBAC Auth API is running ',
      status: 'OK',
    };
  }
}


