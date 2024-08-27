import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let configService = ConfigService;
  let jwtService = JwtService;
  let tokenService = TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            getOrGenerate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    configService = module.get(ConfigService);
    jwtService = module.get(JwtService);
    tokenService = module.get(TokenService);
  });

  it('should be defined all services', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
    expect(configService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(tokenService).toBeDefined();
  });
});
