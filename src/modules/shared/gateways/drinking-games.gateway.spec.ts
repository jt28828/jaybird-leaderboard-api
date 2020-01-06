import { Test, TestingModule } from '@nestjs/testing';
import { DrinkingGamesGateway } from './drinking-games.gateway';

describe('DrinkingGamesGateway', () => {
  let gateway: DrinkingGamesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrinkingGamesGateway],
    }).compile();

    gateway = module.get<DrinkingGamesGateway>(DrinkingGamesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
