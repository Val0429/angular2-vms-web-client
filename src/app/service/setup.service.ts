import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import * as Globals from '../globals';

@Injectable()
export class SetupService {

    private uriServerConfig: string = Globals.cgiRoot + "config";

    constructor(
        private coreService: CoreService,
        private loginService: LoginService
    ) { }

  async getServerSettings(): Promise<any> {
      var token = this.loginService.getCurrentUserToken();
      var result = await this.coreService.getConfig({ path: this.uriServerConfig, query:"?sessionId="+token.sessionId }).toPromise();
      console.log("get config result", result);
      return result;
    }

    async modifyServerSettings(data:any): Promise<any> {
      var token = this.loginService.getCurrentUserToken();
      data.sessionId = token.sessionId;
      console.log("new config data", data);
      var result = await this.coreService.postConfig({ path: this.uriServerConfig, data: data }).toPromise();
      return result;
    }
}
