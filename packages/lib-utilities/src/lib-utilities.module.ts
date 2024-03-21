import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { path } from 'app-root-path';
import { join } from 'path';
import { SharedConfigSchema } from './services/config/shared-config.schema';
import { SharedConfigService } from './services/config/shared-config.service';
import { AppLoggerService } from './services/logger/app-logger.service';
import { AppPackageJsonService } from './services/package/packageJson.service';
import { AppLoggerModule } from './services/logger/app-logger.module';
import { PathsService } from './services/paths/paths.service';

/**
 * The AppUtilitiesModule is a ground-up module, which provides some fundamental 
 * services which we have to be careful about depending on each other. Once loaded, 
 * the SharedModule, or any module, can depend on the AppUtilitiesModule.
 * 
 * The AppPackageService provides information about the app in the form of package.json
 * information and other pathing data. It depends on nothing.
 * 
 * The ConfigModule and sebsequent more opinionated SharedConfigModule provides generic
 * settings data, based on environment variables (either from .env or otherwise injected).
 * 
 * The AppLoggerModule is the only way of logging (only to stdout) for the entire app.
 * It depends on AppPackageJsonService and SharedConfigService, the module waits for
 * those services to be available using ModuleRef().
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: SharedConfigSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false, // output all errors

      },
      envFilePath: `.env.${process.env.NODE_ENV}`,
      ignoreEnvFile: !processEnv.isDebug,
      cache: true,
    }),
    forwardRef(() => AppLoggerModule)
  ],
  providers: [
    ConfigService,
    SharedConfigService,
    AppPackageJsonService,
    AppLoggerService,
    PathsService
  ],
  exports: [
    ConfigService, 
    SharedConfigService, 
    AppLoggerService, 
    AppPackageJsonService,
    PathsService
  ],
})
export class LibUtilitiesModule implements OnModuleInit {
  constructor(
    private readonly sharedConfig: SharedConfigService,
    private readonly l: AppLoggerService,
    private readonly pj: AppPackageJsonService,
  ) {
  }

  async onModuleInit() {
    this.l.info(`Loaded package.json ${this.pj.ctx.appPj.name}:${this.pj.ctx.appPj.version}`);
  } 
  
}
