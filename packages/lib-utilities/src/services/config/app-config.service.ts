import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { ProcessEnv } from "./app-config.schema.js";


@Injectable()
export class AppConfigService {
  constructor(
    private configService: ConfigService<ProcessEnv, true>) { 
  }

  get<T extends keyof ProcessEnv>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
