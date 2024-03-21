import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { CurlHelper } from './curlarize';
import { isNativeError } from 'util/types';
import { AxiosResult } from './AxiosResult';
import { AppLoggerService } from '../logger/app-logger.service';

export class AxiosService {
  constructor(
    public l?: AppLoggerService | undefined,
    public timeout = 30000,
  ) {
    this.logger = this.l ? this.l : console;
  }

  private logger: AppLoggerService | Console;

  public async request<TResponseType, TBodyType = unknown>(
    cfg: AxiosRequestConfig<TBodyType>,
  ): Promise<AxiosResult<TResponseType, TBodyType>> {
    cfg = {
      ...cfg,
      timeout: this.timeout,
    };

    // Add the validationStatus because we don't want to auto-throw
    // however don't overwrite it when it's already user suplied.
    if (!cfg.validateStatus) {
      cfg = {
        ...cfg,
        validateStatus: (status) => true,
      }
    }

    if (!cfg.method) {
      cfg.method = 'GET';
    }

    const a = axios.create(cfg);
    const target = `${cfg.method} => ${a.getUri(cfg)}`;
    let elapsedMs: number | undefined;

    this.logger.debug(target, 'axios');

    const curl = new CurlHelper(a, cfg);
    this.logger.debug(curl.generateCommand(), 'curl');

    let before = performance.now();

    let response: AxiosResponse<TResponseType> | undefined;
    let aborted = false;
    let timedout = false;
    let canceled = false;
    let error: AxiosError | undefined;

    try {
      this.logger.info({
        method: cfg.method,
        url: cfg.url,
        headers: cfg.headers,
      }, 'axios');
      response = await axios.request<TResponseType>(cfg);
    } catch (err: unknown) {
      this.logger.error(err);
      // NOTE: Make sure we ALWAYS return an AxiosError even when
      // a different error is thrown. This is for consistancy. 

      // https://github.com/axios/axios/discussions/4971
      if (err instanceof AxiosError) {
        aborted = err.code === 'ECONNABORTED';
        timedout = err.code === 'ETIMEDOUT';
        canceled = err.code === 'ERR_CANCELED';
        
        error = err;
      } else if(isNativeError(err)) {
        error = new AxiosError<TResponseType, TBodyType>(err.message);
        error.name = err.name;
        error.cause = err;
        error.stack = err.stack;
      } else {
        error = new AxiosError<TResponseType, TBodyType>(String(err));
      }
    } finally {
      const after = performance.now();
      elapsedMs = after - before;
    }

    if (response) {
      response.headers['x-response-time'] = elapsedMs;
      this.logger.info(`${target} (${response.status} in ${elapsedMs} ms)`, 'axios');
    }

    return new AxiosResult<TResponseType, TBodyType>(
      cfg,
      elapsedMs,
      timedout,
      this.timeout,
      aborted,
      canceled,
      response,
      error,
    );
  }
}
