import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { z } from "zod";

@Injectable()
export class AppConfigService<TSchema extends z.ZodRawShape = {}> {
  constructor(
    private configService: ConfigService<z.ZodObject<TSchema>, true>) { 
  }

  get<T extends keyof z.ZodObject<TSchema>>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
