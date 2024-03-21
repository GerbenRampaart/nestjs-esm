import { AxiosInstance, AxiosRequestConfig } from "axios";

export class CurlHelper {
  constructor(
    public instance: AxiosInstance,
    public request: AxiosRequestConfig) {
    this.method = this.request.method || 'GET';
  }

  private method: string;

  getHeaders() {
    let curlHeaders = '';

    if (this.request.headers) {
      for (let property in this.request.headers) {
        let header = `${property}:${this.request.headers[property]}`;
        curlHeaders = `${curlHeaders} -H "${header}"`;
      }
    }

    return curlHeaders.trim();
  }

  getBody() {
    const j = JSON.stringify(this.request.data);

    if (j) {
      return `--data '${j}'`; 
    }

    return '';
  }

  generateCommand(): string {
    try {
      return `curl -i -v -L -X ${this.method.toUpperCase()} "${this.instance.getUri(this.request)}" ${this.getHeaders()} ${this.getBody()}`
      .trim()
      .replace(/\s{2,}/g, ' ');
    } catch (err: any) {
      // At no point can the curlarize class ever throw an error.
      return err.message ? err.message : 'unknown error';
    }
  }
}