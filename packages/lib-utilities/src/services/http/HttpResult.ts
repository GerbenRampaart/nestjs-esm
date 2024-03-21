import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

/*

| ERR_BAD_OPTION_VALUE | Invalid or unsupported value provided in axios configuration. |
| ERR_BAD_OPTION | Invalid option provided in axios configuration. |
| ECONNABORTED | Request timed out due to exceeding timeout specified in axios configuration. |
| ETIMEDOUT | Request timed out due to exceeding default axios timelimit. |
| ERR_NETWORK | Network-related issue.
| ERR_FR_TOO_MANY_REDIRECTS | Request is redirected too many times; exceeds max redirects specified in axios configuration.
| ERR_DEPRECATED | Deprecated feature or method used in axios. 
| ERR_BAD_RESPONSE | Response cannot be parsed properly or is in an unexpected format. 
| ERR_BAD_REQUEST | Requested has unexpected format or missing required parameters. |
| ERR_CANCELED | Feature or method is canceled explicitly by the user.   
| ERR_NOT_SUPPORT | Feature or method not supported in the current axios environment. 
| ERR_INVALID_URL | Invalid URL provided for axios request.

*/
export class HttpResult<TResponseType, TBodyType = unknown> {
  constructor(
    public config: AxiosRequestConfig<TBodyType>,
    public response?: AxiosResponse<TResponseType, TBodyType>,
    public error?: AxiosError,
  ) {
  }

  public get timedOut() {
    return this.error?.code === 'ETIMEDOUT' || 
      this.error?.code === 'ECONNABORTED';
  }

  public get canceled() {
    return this.error?.code === 'ERR_CANCELED';
  }

  public get elapsed() : number | undefined {
    if (this.response === undefined) {
      return undefined;
    }

    const rtHeader = this.response.headers['x-response-time'];
  }

  public get ok() {
    return (this.response !== undefined && 
      this.response.status >= 200 && 
      this.response.status < 300 && 
      this.error === undefined);
  }
}