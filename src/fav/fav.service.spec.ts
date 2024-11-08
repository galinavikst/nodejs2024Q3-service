import { Test, TestingModule } from '@nestjs/testing';
import { FavService } from './fav.service';

describe('FavService', () => {
  let service: FavService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavService],
    }).compile();

    service = module.get<FavService>(FavService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
