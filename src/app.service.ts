import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'tinty store API';
  }

  getHealth(): string {
    return 'I am healthy!';
  }
}
