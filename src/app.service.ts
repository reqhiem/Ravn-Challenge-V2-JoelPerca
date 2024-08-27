import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Vip & Savor Store API';
  }

  getHealth(): string {
    return 'I am healthy!';
  }
}
