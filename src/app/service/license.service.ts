import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { ConfigService } from './config.service';
import { License } from '../Interface/interface';

@Injectable()
export class LicenseService  {
    uriMac: string;
    uriLicense: string;

  async read(): Promise<License[]> {
    let token = this.loginService.getCurrentUserToken();        
    var items : License[]= [];
    var result = await this.coreService.getConfig({path:this.uriLicense+"?sessionId="+token.sessionId}).toPromise();
      console.log("read result: ",result);
      if (result && result["licenses"]) {        
        result["licenses"].forEach(function (item) {
          if (item) items.push(item);
        });
      }
      return items;
  }
  async readMac(): Promise<string[]> {
    
    let token = this.loginService.getCurrentUserToken();            
    return await this.coreService.getConfig({path:this.uriMac+"?sessionId="+token.sessionId}).toPromise();
     
  }
    
    async post(keyOrData: string, mac:string): Promise<any> {
        let token = this.loginService.getCurrentUserToken();
        return await this.coreService.postConfig({path:this.uriLicense+"?sessionId="+token.sessionId,data:{keyOrData, mac}}).toPromise();
    }  
    
    constructor(
        private coreService: CoreService,
        private loginService: LoginService,
        private configService:ConfigService
    ) { 
      
      this.uriLicense = this.configService.getCgiRoot() + "license";
      this.uriMac = this.configService.getCgiRoot()+"mac";
    }

}
