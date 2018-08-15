import { Injectable } from '@angular/core';
//import { Router } from '@angular/router';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Rx';
import { Group, NotificationDevice } from 'app/Interface/interface';
import * as Globals from '../globals';

@Injectable()
export class SetupService {
    //private webRoot: string = "http://172.16.10.88:8088/";
    //private webRoot: string = "http://203.69.170.41:8088/";
    //private webRoot: string = document.location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/';

    private uriServerConfig: string = Globals.cgiRoot + "config";

    constructor(
        private coreService: CoreService,
        private loginService: LoginService
    ) { }

  async getServerSettings(): Promise<any> {
      var me = this;
      var token = this.loginService.getCurrentUserToken();
      var result = await this.coreService.getConfig({ path: this.uriServerConfig, query:"?sessionId="+token.sessionId }).toPromise();
      console.log("get config result", result);
      return result;
    }

    async modifyServerSettings(data:any): Promise<any> {
      var me = this;
      var token = this.loginService.getCurrentUserToken();
      data.sessionId = token.sessionId;
      console.log("new config data", data);
      var result = await this.coreService.postConfig({ path: this.uriServerConfig, data: data }).toPromise();
      return result;
    }
}
