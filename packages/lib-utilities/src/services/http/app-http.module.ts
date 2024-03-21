import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppLoggerService } from '../logger/app-logger.service';
import { AppHttpService } from './app-http.service';
import { TestService } from './test/test.service';

@Module({
  imports: [
    HttpModule.register({}),
  ],
  providers: [
    AppLoggerService,
  ],
  exports: [
    AppHttpService
  ]
})
export class AppHttpModule { }
