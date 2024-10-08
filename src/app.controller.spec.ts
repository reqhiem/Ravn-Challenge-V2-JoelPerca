import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Vip & Savor Store API"', () => {
      expect(appController.getHello()).toBe('Vip & Savor Store API');
    });

    it('should return "I am healthy!"', () => {
      expect(appController.getHealth()).toBe('I am healthy!');
    });
  });
});
