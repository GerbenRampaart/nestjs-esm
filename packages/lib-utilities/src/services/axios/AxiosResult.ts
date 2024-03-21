import { HttpException } from "@nestjs/common";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export class AxiosResult<TResponseType, TBodyType = unknown> {
  constructor(
    public config: AxiosRequestConfig<TBodyType>,
    public elapsedMs: number,
    public timedout: boolean,
    public timeout: number,
    public aborted: boolean,
    public canceled: boolean,
    public response?: AxiosResponse<TResponseType>,
    public error?: AxiosError,
  ) {

  }

  /**
   * This function is intended to be run without any side-effects if NO error occurred.
   * Run this in case you want to throw a NestJs HttpException with the AxiosError serialized
   * in there. You can use your own ErrorFilter to adjust it further.
   * 
   * This will only throw an exception if this.ok is false and there is an error object (this.error).
   * In other words, if the request went well, nothing will happen.
   * 
   * if (axiosResult.ok) {
   *  // Your happy path code
   * }
   * 
   * // Free to invoke this 
   * axiosResult.throwHttpExceptionIfError(400); // throw exception (if any) and force a BAD_REQUEST
   * 
   * @param forceStatus (optional)
   * Override the status in the thrown HttpException with your own status. If not 
   * supplied, the function will try to get the http status from axiosResult.error.response.status,
   * (essentialy re-throwing the http status the api you called returned), if not available, it 
   * defaults to 500.
   * 
   * @param forceMessage (optional)
   * Defaults to error.message or error.toJSON
   */
  public throwHttpExceptionIfError(forceStatus?: number, forceMessage?: string): void {
    if(!this.ok && this.error) {      
      if (this.error.response) {
        const status = forceStatus ?? this.error.response.status ?? 500;
        throw new HttpException(forceMessage ?? this.error.toJSON(), status, {
          cause: this.error
        });
      } else {
        const status = forceStatus ?? 500;
        throw new HttpException(forceMessage ?? this.error.message, status, {
          cause: this.error
        });
      }
    }
  }

  /**
   * This will return true if:
   * - There is a this.response object (there won't be when an exception occurred).
   * - There is NO this.error object (there always is when an error occurred).
   * - The response status is in the 200..299 range.
   * 
   * otherwise false.
   * 
   * In other words, this is always safe code:
   * 
   * if (axiosResult.ok) {
   *  // Your happy path code with axiosResult.response available
   * }
   */
  public get ok(): boolean {
    return (
      this.response && 
      !this.error && 
      this.response.status > 199 && 
      this.response.status < 300) 
      ?? false;
  }
}
