import { Test, TestingModule } from '@nestjs/testing';
import { AppHttpService } from './app-http.service';

describe('AppHttpService', () => {
  let service: AppHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppHttpService
      ],
    }).compile();

    service = module.get<AppHttpService>(AppHttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
});
