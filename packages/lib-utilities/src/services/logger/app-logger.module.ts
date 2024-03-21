import { Module, forwardRef } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';
import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage } from 'http';
import { ServerResponse } from 'http';
import { ReqId } from 'pino-http';
import { v4 } from 'uuid';
import { SharedConfigService } from '../config/shared-config.service';
import { AppPackageJsonService } from '../package/packageJson.service';
import { PrettyOptions } from 'pino-pretty';
import { LibUtilitiesModule } from '../../lib-utlities.module';
import { processEnv } from '../../utils/processEnv';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [
        forwardRef(() => LibUtilitiesModule)
      ],
      inject: [
        SharedConfigService,
        AppPackageJsonService
      ],
      useFactory: async (
        config: SharedConfigService,
        pj: AppPackageJsonService) => {

        // https://github.com/pinojs/pino-pretty#options
        const options: PrettyOptions = {
          colorize: true,
          singleLine: false,
        }

        return {
          pinoHttp: {
            level: config.logLevel,
            name: `${pj.ctx.appPj.name}:${pj.ctx.appPj.version}`,
            transport: processEnv.isDebug ? {
              target: 'pino-pretty',
              options
            } : undefined, // undefined = stdout
            genReqId: (req: IncomingMessage, res: ServerResponse): ReqId => {
              const cId = 'x-correlation-id';
              const rId = 'x-request-id';

              const corId = req.headers[cId]?.toString() ?? v4();
              const reqId = req.headers[rId]?.toString() ?? v4();

              req.headers[cId] = corId;
              req.headers[rId] = reqId;

              res.setHeader(cId, corId);
              res.setHeader(rId, reqId);

              return reqId;
            }
          },
        };
      }
    })
  ],
  providers: [
    AppLoggerService
  ],
  exports: [
    AppLoggerService
  ]
})
export class AppLoggerModule { }
