import { Injectable } from '@angular/core';
//import { Router } from '@angular/router';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Rx';
import { visitorProfile } from 'app/Interface/interface';
import * as Globals from '../globals';

@Injectable()
export class InvitationService {
    private uriInvitationList: string = Globals.cgiRoot + "frs/cgi/getgrouplist";

    constructor(
        private coreService: CoreService,
        private loginService: LoginService
    ) { }

    async getInvitationList(): Promise<visitorProfile[]> {
        var me = this;
        var token = me.loginService.getCurrentUserToken();
    
        var invitations = [];
        var result = await me.coreService.getConfig({ path: this.uriInvitationList, query: "?sessionId=" + token.sessionId }).toPromise();
        console.log(result);
    
        // if (result["message"] == "ok") {

        //     var invitations = result["list"];
            
        // }

        return invitations;
      }

      async updateInvitation(data: visitorProfile): Promise<visitorProfile> {

        let result = data ;

        // let token = this.loginService.getCurrentUserToken();
    
        // let result = await this.coreService.putConfig({ path: this.uriKioskCrud + "?sessionId=" + token.sessionId, data: data }).toPromise();
    
        // console.log("update kiosk result: ", result);
    
        return result;
      }

}