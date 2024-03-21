import { Test, TestingModule } from "@nestjs/testing";
import { AppConfigService } from "./app-config.service";
import { AppConfigModule } from "./app-config.module";

describe("AppHttpService", () => {
  let service: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppConfigModule,
      ],
      providers: [
        AppConfigService,
      ],
    }).compile();

    service = await module.resolve<AppConfigService>(AppConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
