import { Injectable, Scope } from "@nestjs/common";
import { AxiosService } from "./axios.service";
import { SharedConfigService } from "../../utilities/config/shared-config.service";
import { AppLoggerService } from "../../utilities/logger/app-logger.service";

@Injectable({
  scope: Scope.REQUEST
})
/**
 * NOTE: This is a REQUEST-SCOPED service !!
 * Meaning you should only inject this into services which are 
 * themselves request scoped. (otherwise nestjs will auto-request
 * scope them and that is probably not intended).
 * 
 * The benefit of using this request scoped variant is that all logging
 * related to this request is logged under the same correlation context
 * by pino. 
 */
export class AxiosHttpService {
  constructor(
    private readonly cfg: SharedConfigService,
    private readonly l: AppLoggerService
  ) {
    this._axios = new AxiosService(l);
  }

  private _axios: AxiosService;

  public get axios(): AxiosService {
    return this._axios;
  }
}