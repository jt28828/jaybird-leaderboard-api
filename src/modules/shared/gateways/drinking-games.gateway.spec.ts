import { Test, TestingModule } from '@nestjs/testing';
import { ServerMessagesGateway } from './server-messages.gateway';

describe('DrinkingGamesGateway', () => {
  let gateway: ServerMessagesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerMessagesGateway],
    }).compile();

    gateway = module.get<ServerMessagesGateway>(ServerMessagesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
