import { Test, TestingModule } from '@nestjs/testing';
import { FavController } from './fav.controller';

describe('FavController', () => {
  let controller: FavController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavController],
    }).compile();

    controller = module.get<FavController>(FavController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
