import { Injectable, Scope } from '@nestjs/common';
import { AppLoggerService } from '../logger/app-logger.service';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { v4 } from 'uuid';
import { lastValueFrom } from 'rxjs';
import { HttpResult } from './HttpResult';
import { AxiosError } from 'axios';
import { isNativeError } from 'util/types';

type AxiosRequestConfigWithMetadata = InternalAxiosRequestConfig<any> & { metadata?: any };

@Injectable({
  // Transient providers are not shared across consumers. 
  // Each consumer that injects a transient provider will receive a new, dedicated instance.
  // https://docs.nestjs.com/fundamentals/injection-scopes
  scope: Scope.TRANSIENT
})
export class AppHttpService {
  constructor(
    private readonly l: AppLoggerService,
    private readonly http: HttpService,
  ) {
    const timeout = 30000;
    http.axiosRef.defaults.timeout = timeout;

    this.l.debug(`If no timeout is provided in the request(cfg), the default timeout is ${timeout}ms.`);

    http.axiosRef.interceptors.request.use((cfg: AxiosRequestConfigWithMetadata) => {
      cfg.metadata = cfg.metadata || {};
      cfg.metadata.start = process.hrtime();

      l.info({
        method: cfg.method,
        url: cfg.url,
        headers: cfg.headers,
      });

      return cfg;
    });

    http.axiosRef.interceptors.response.use((res) => {
      const cfg = res.config as AxiosRequestConfigWithMetadata;
      let elapsed: number | undefined = undefined;

      if (cfg.metadata) {
        const start = cfg.metadata.start;
        const end = process.hrtime(start);

        // (just for reference I'm including the copilot explanation of the next line of code)
        /*
          This line of code calculates the elapsed time in milliseconds.
          The end variable is an array with two numbers, 
          representing the high-resolution real time from process.hrtime(). 
          The first number end[0] is in seconds, and the second number end[1] is in nanoseconds.

          (end[0] * 1000) converts the seconds to milliseconds.
          (end[1] / 1000000) converts the nanoseconds to milliseconds 
          (since 1 millisecond is 1,000,000 nanoseconds).

          Adding these two values together gives the total elapsed time in milliseconds.
          Finally, Math.round() is used to round this value to the nearest whole number, 
          since the time in milliseconds is usually represented as an integer.
        */
        elapsed = Math.round((end[0] * 1000) + (end[1] / 1000000));
      }

      l.log({
        method: res.config.method,
        url: res.config.url,
        headers: res.config.headers,
        status: res.status,
        elapsed: elapsed ?? '?',
      });

      res.headers['x-response-time'] = elapsed;

      return res;
    });
  }

  public async request<TResponseType, TBody>(
    cfg: AxiosRequestConfig<TBody>,
    correlationId = v4(),
    requestId = v4(),
  ): Promise<
    HttpResult<
      TResponseType,
      TBody>
  > {

    cfg.headers = {
      ...cfg.headers,
      'x-correlation-id': correlationId,
      'x-request-id': requestId,
    };

    cfg.validateStatus = (status) => true;

    let response: AxiosResponse<TResponseType, TBody> | undefined = undefined;
    let error: AxiosError<TResponseType, TBody> | undefined = undefined;

    try {
      response = await lastValueFrom(
        this.http.request<TResponseType>(cfg)
      );
    } catch (err: unknown) {

      // https://github.com/axios/axios/blob/d844227411263fab39d447442879112f8b0c8de5/README.md?plain=1#L614
      if (err instanceof AxiosError) {
        error = err;
      } else if (isNativeError(err)) {
        error = new AxiosError<TResponseType, TBody>(err.message);
        error.name = err.name;
        error.cause = err;
        error.stack = err.stack;
      } else {
        error = new AxiosError<TResponseType, TBody>(String(err));
      }
    }

    return new HttpResult<TResponseType, TBody>(cfg, response, error);
  }
}