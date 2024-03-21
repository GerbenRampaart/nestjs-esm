import { Module, forwardRef, type DynamicModule } from "@nestjs/common";
import { AppConfigService } from "./app-config.service.js";
import { AppConfigSchema } from "./app-config.schema.js";
import { ConfigModule } from "@nestjs/config";
import { NodeEnv } from "../../util/NodeEnv.js";
import { AppLoggerModule } from "../logger/app-logger.module.js";

@Module({
  imports: [
    ConfigModule.reg.forRoot({
      validate: (env) => {
        return AppConfigSchema.parse(env);
      },
      isGlobal: true,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false, // output all errors
      },
      envFilePath: `.env.${process.env.NODE_ENV}`,
      ignoreEnvFile: !NodeEnv.isDebug,
      cache: true,
    }),
    forwardRef(() => AppLoggerModule),
  ],
  providers: [
    AppConfigService
  ],
  exports: [
    AppConfigService
  ],
})
export class AppConfigModule { 
  static registerAsync(): DynamicModule {
    return {
      module: AppConfigModule,
      imports: [AppLoggerModule],
      providers: [AppConfigService],
      exports: [AppConfigService],
    };
  }
}