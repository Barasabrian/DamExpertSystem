import { Test, TestingModule } from '@nestjs/testing';
import { PredictionService } from './prediction.service';

describe('PredictionService', () => {
  let service: PredictionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PredictionService],
    }).compile();

    service = module.get<PredictionService>(PredictionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
