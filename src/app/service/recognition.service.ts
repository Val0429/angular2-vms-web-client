import { Injectable } from '@angular/core';
//import { Router } from '@angular/router';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Rx';
import { Face_Settings, Recognition_Settings } from 'app/Interface/interface';
import * as Globals from '../globals';

@Injectable()
export class RecognitionService {
    private uriGetFcsSettings: string = Globals.cgiRoot + "frs/cgi/getfcssettings";
    private uriModifyFcsSettings: string = Globals.cgiRoot + "frs/cgi/modifyfcssettings";
    

    constructor(
        private _coreService: CoreService,
        private _loginService: LoginService
    ) { }

    async getFcsSettings(): Promise<String> {
        var me = this;
        var token = this._loginService.getCurrentUserToken();

        let data: string = `{ "session_id":"` + token.session_id + `" }`;

        var result = await this._coreService.postConfig({ path: this.uriGetFcsSettings, data: data }).toPromise();
        console.log(result);

        if (result["message"] == "ok")
            return result["fcs_settings"];
        else
            return JSON.parse(`[]`) ;
    }

    async modifyFcsSettings(_setting: string): Promise<String> {
        var me = this;
        var token = this._loginService.getCurrentUserToken();
        var newSetting = JSON.parse(_setting);

        // {   "session_id":"19760613", 
        //     "server_settings" : { 
        //         "settings": {
        //             "apns_push_settings": {
        //                 "apns_topic": "com.isapsolution.frs",

        let data: string = `{ "session_id":"` + token.session_id + `", "fcs_settings" : ` + _setting + ` }`;

        var result = await this._coreService.postConfig({ path: this.uriModifyFcsSettings, data: data }).toPromise();

        if (result["message"] == "ok") {
            return JSON.parse(`{"message": "ok"}`) ;           
        }
        else {
            return null;
        }
    }
}
