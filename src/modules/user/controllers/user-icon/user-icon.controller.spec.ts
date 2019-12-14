import { Test, TestingModule } from '@nestjs/testing';
import { UserIconController } from './user-icon.controller';

describe('UserIcon Controller', () => {
  let controller: UserIconController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserIconController],
    }).compile();

    controller = module.get<UserIconController>(UserIconController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
