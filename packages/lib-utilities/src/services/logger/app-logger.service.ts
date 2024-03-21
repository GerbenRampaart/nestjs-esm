import { Inject, Injectable  } from '@nestjs/common';
import { PARAMS_PROVIDER_TOKEN, Params, PinoLogger } from 'nestjs-pino';
import { LevelWithSilent } from 'pino';
import { pinoLevels } from './levels';

@Injectable()
export class AppLoggerService extends PinoLogger {
  constructor(
    @Inject(PARAMS_PROVIDER_TOKEN) private readonly params: Params
  ) {
    super(params);
  }

  public set level(lvl: string) {
    if (!pinoLevels.includes(lvl)) {
      throw new Error(`Tried to set LogLevel ${lvl}. Supported levels: ${pinoLevels.join(', ')}`);
    }

    PinoLogger.root.level = lvl;
  }

  public get level(): LevelWithSilent {
    return PinoLogger.root.level as LevelWithSilent;
  }

  /** 
   * We used to use Winston which had a log() instead of Pino's info().
   * So this is purely for backwards compat reasons and does the same thing as info()
  */
  public log(obj: unknown, msg?: string | undefined, ...args: any[]): void {
    this.info(obj, msg, ...args);
  }
}
