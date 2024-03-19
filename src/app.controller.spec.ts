import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller.ts";
import { AppModule } from "./app.module.ts";

describe("AppController", () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
      ],
      controllers: [
        AppController,
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
