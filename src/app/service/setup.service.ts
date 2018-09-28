import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import * as Globals from '../globals';

@Injectable()
export class SetupService {


    private uriServerConfig: string = Globals.cgiRoot + "config";
    private uriTestEmail: string = Globals.cgiRoot + "test/email";
    private uriTestSms: string = Globals.cgiRoot + "test/sms";
    constructor(
        private coreService: CoreService,
        private loginService: LoginService
    ) { }


  async sendTestSms(phone: string): Promise<any> {
    var token = this.loginService.getCurrentUserToken();
      let data : any = {};
      data.sessionId = token.sessionId;
      data.phone = phone;
      console.log("test sms data", data);
      var result = await this.coreService.postConfig({ path: this.uriTestSms, data: data }).toPromise();
      return result;
  }
   async sendTestEmail(email: string): Promise<any> {
      var token = this.loginService.getCurrentUserToken();
      let data : any = {};
      data.sessionId = token.sessionId;
      data.email = email;
      console.log("test email data", data);
      var result = await this.coreService.postConfig({ path: this.uriTestEmail, data: data }).toPromise();
      return result;
  }

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
