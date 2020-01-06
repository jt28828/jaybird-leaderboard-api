import { Test, TestingModule } from "@nestjs/testing";
import { TwitterUpdateController } from "./twitter-update.controller";

describe("TwitterUpdate Controller", () => {
  let controller: TwitterUpdateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwitterUpdateController],
    }).compile();

    controller = module.get<TwitterUpdateController>(TwitterUpdateController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
