import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({ status: HttpStatus.OK, description: 'Hello World' })
  @Get()
  @HttpCode(HttpStatus.OK)
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiResponse({ status: HttpStatus.OK, description: "I'm healthy" })
  @HttpCode(HttpStatus.OK)
  @Get('/health')
  getHealth(): string {
    return this.appService.getHealth();
  }
}
