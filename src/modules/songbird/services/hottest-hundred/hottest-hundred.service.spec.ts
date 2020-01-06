import { Test, TestingModule } from "@nestjs/testing";
import { HottestHundredService } from "./hottest-hundred.service";

describe("HottestHundredService", () => {
  let service: HottestHundredService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HottestHundredService],
    }).compile();

    service = module.get<HottestHundredService>(HottestHundredService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
