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

    private uriGetServerSettings: string = Globals.cgiRoot + "config";
    private uriModifyServerSettings: string = Globals.cgiRoot + "frs/cgi/modifyserversettings";
    

    constructor(
        private _coreService: CoreService,
        private _loginService: LoginService
    ) { }

    async getServerSettings(): Promise<String> {
        var me = this;
        var token = this._loginService.getCurrentUserToken();

        

      var result = await this._coreService.getConfig({ path: this.uriGetServerSettings, query:"?sessionId="+token.sessionId }).toPromise();
        console.log(result);

        if (result["message"] == "ok")
            return result["server_settings"]["settings"];
        else
            return JSON.parse(`{"settings": {}}`) ;
    }

    async modifyServerSettings(_setting: string): Promise<String> {
        var me = this;
        var token = this._loginService.getCurrentUserToken();
        var newSetting = JSON.parse(_setting);

        // {   "session_id":"19760613", 
        //     "server_settings" : { 
        //         "settings": {
        //             "apns_push_settings": {
        //                 "apns_topic": "com.isapsolution.frs",

        let data: string = `{ "session_id":"` + token.sessionId + `", "server_settings" : { "settings": {` + _setting + `} } }`;

        var result = await this._coreService.postConfig({ path: this.uriModifyServerSettings, data: data }).toPromise();

        if (result["message"] == "ok") {
            return JSON.parse(`{"message": "ok"}`) ;           
        }
        else {
            return null;
        }
    }
}
