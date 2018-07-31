import { Injectable } from '@angular/core';
//import { Router } from '@angular/router';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Rx';
import { Group, NotificationDevice } from 'app/Interface/interface';
import * as Globals from '../globals';

@Injectable()
export class ActionService {
    //private webRoot: string = "http://172.16.10.88:8088/";
    //private webRoot: string = "http://203.69.170.41:8088/";
    //private webRoot: string = document.location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/';


    private uriGetPushDeviceList: string = Globals.cgiRoot + "frs/cgi/getpushdevicelist";
    // replace with registerpushdevice (have uuid)
    private uriAddPushDevice: string = Globals.cgiRoot + "frs/cgi/addpushdevice";
    
    //private uriRegisterPushDevice: string = Globals.cgiRoot + "frs/cgi/registerpushdevice";
    // { 
    //     "session_id":"19760613", 
    //     "push_device_type" : "ios", 
    //     "push_device_uuid" : "123",
    //     "push_device_name" : "ken - iphone", 
    //     "push_device_token" : "044d48a7b05ad7bb375c3bfcdf0477f18b1295b6e629285a7a8f289a8ca6f6db"
    // }


    private uriDeletePushDeviceList: string = Globals.cgiRoot + "frs/cgi/deletepushdevicelist";


    private uriGetGroupPushAction: string = Globals.cgiRoot + "frs/cgi/getgrouppushaction";
    private uriModifyGroupPushAction: string = Globals.cgiRoot + "frs/cgi/modifygrouppushaction";
    // private uriModifyGroupMailAction: string = Globals.cgiRoot + "frs/cgi/modifygroupmailaction";
    // { 
    //     "session_id":"19760613", 
    //     "group_id" : "5ae17a372a49132e8b68c00f", 
    //     "mail_action": {
    //         "mail_action_interval": 30,
    //         "mail_action_attach_photo": 1,
    //         "mail_action_mail_receiver_list": [
    //             "ken.chan@isapsolution.com"
    //         ]
    //     }
    // }

    constructor(
        //private _router: Router,
        private _coreService: CoreService,
        private _loginService: LoginService
    ) { }

    async getPushDeviceList(): Promise<NotificationDevice[]> {
        var me = this;
        var token = this._loginService.getCurrentUserToken();

        let data: string = `{ "session_id":"` + token.session_id + `", "page_size" : 999, "skip_pages" : 0 }`;

        var _devices = [];
        var result = await this._coreService.postConfig({ path: this.uriGetPushDeviceList, data: data }).toPromise();
        console.log(result);
        // "push_device_list": {
        //     "ios": [
        //         {
        //             "push_device_id": "5ae6e84b9807c40df1d25035",
        //             "push_device_name": "ken - iphone",
        //             "push_device_token": "044d48a7b05ad7bb375c3bfcdf0477f18b1295b6e629285a7a8f289a8ca6f6db"
        //         }
        //     ],
        //     "android": [
        //         {
        //             "push_device_id": "5ae6e8769807c40df1d25616",
        //             "push_device_name": "android phone",
        //             "push_device_token": "dKIvkfqwkGU:APA91bHklQqcAa8U-qZfIlHulWJVDLr0N_79-TTDn7aGcFmy-RaHFI5Y2ucvMDn1mCu1K9uH7sRAgJTpkupCVCPLtE0bDdQGsEWkAGB7tow9_Y1HY0LTgfg2SF-QUHApugdwJ53WmdCF"
        //         }
        //     ],
        // }

        if (result["message"] == "ok") {
            var _list = result["push_device_list"];

            var iosNode = _list["ios"] ;
            iosNode.forEach( function (device) {
                device.push_device_type = "ios" ;
                _devices.push(device);
            });
            
            var andNode = _list["android"];
            andNode.forEach( function (device) {
                device.push_device_type = "android" ;
                _devices.push(device);
            });
        }

        return _devices;
    }

    async addPushDevice(_device: string): Promise<NotificationDevice> {
        var me = this;
        var token = this._loginService.getCurrentUserToken();
        var newDevice = JSON.parse(_device);

        //{ "session_id":"aaMXZzR3Kg", "push_device_type" : "ios", "push_device_name" : "test", "push_device_token" : "test123" }
        let data: string = `{ "session_id":"` + token.session_id + `", "push_device_type" : "` + newDevice["push_device_type"] + `", "push_device_name" : "` + newDevice["push_device_name"] + `", "push_device_token" : "` + newDevice["push_device_token"] + `" }`;

        var result = await this._coreService.postConfig({ path: this.uriAddPushDevice, data: data }).toPromise();

        if (result["message"] == "ok") {
            var deivce = new NotificationDevice();
            deivce.push_device_id = newDevice["push_device_id"];
            deivce.push_device_type = newDevice["push_device_type"];
            deivce.push_device_name = newDevice["push_device_name"];
            deivce.push_device_token = newDevice["push_device_token"];

            return deivce;
        }
        else {
            return null;
        }

    }

    async deletePushDeviceList(_device: string): Promise<boolean> {
        var delDevice = JSON.parse(_device);
        var token = this._loginService.getCurrentUserToken();
        let data: string = `{"session_id":"` + token.session_id + `","push_device_id_list":["` + delDevice.id + `"]}`;

        var result = await this._coreService.postConfig({ path: this.uriDeletePushDeviceList, data: data }).toPromise();
        console.log(result);

        if (result["message"] == "ok") {
            return true;
        }
        else {
            return false;
        }
    }

    async modifyDevice(_device: string) {
        var modDevice = JSON.parse(_device);
        var token = this._loginService.getCurrentUserToken();

        var device = new NotificationDevice();
        //if (result["message"] == "ok") {
        if ("ok" == "ok") {
            device.push_device_id = modDevice["push_device_id"];
            device.push_device_type = modDevice["mode"];
            device.push_device_name = modDevice["push_device_name"];
            device.push_device_token = modDevice["push_device_token"];

            return device;
        }
        return null;
    }

    async getGroupPushAction(_group:string) {
        var me = this;
        var modgroup = JSON.parse(_group);
        var token = this._loginService.getCurrentUserToken();

        let data: string = `{ "session_id":"` + token.session_id + `", "group_id" : "` + modgroup["group_id"] + `" }`;

        var _devices = [];
        var result = await this._coreService.postConfig({ path: this.uriGetGroupPushAction, data: data }).toPromise();
        console.log(result);

        // {
        //     "message": "ok",
        //     "push_action": {
        //     "push_action_interval": 1,
        //     "push_action_device_list": [
        //         {
        //             "push_device_id": "5ae6e84b9807c40df1d25035",
        //             "push_device_type": "ios",
        //             "push_device_name": "ken - iphone",
        //             "push_device_token": "044d48a7b05ad7bb375c3bfcdf0477f18b1295b6e629285a7a8f289a8ca6f6db"
        //         },

        var _devices = [];

        if (result["message"] == "ok") {
            return result["push_action"];
        }
        
        return _devices;
    }

    async modifyGroupPushAction(_group:string) {
        console.log(_group);

        var modGroup = JSON.parse(_group);
        var token = this._loginService.getCurrentUserToken();
        // {
        //     "session_id":"19760613", 
        //     "group_id" : "5ae17a372a49132e8b68c00f", 
        //     "push_action": {
        //         "push_action_interval": 30,
        //         "push_action_device_list": [
        //             {
        //                 "push_device_id": "5ae6e84b9807c40df1d25035",
        //                 "push_device_type": "ios",
        //                 "push_device_name": "ken - iphone",
        //                 "push_device_token": "044d48a7b05ad7bb375c3bfcdf0477f18b1295b6e629285a7a8f289a8ca6f6db"
        //             },

        let data: string = `{"session_id":"` + token.session_id + `", "group_id" : "` + modGroup["id"] + `", "push_action" : ` + JSON.stringify(modGroup["push_action"]) + ` }`;

        console.log(data);

        var result = await this._coreService.postConfig({ path: this.uriModifyGroupPushAction, data: data }).toPromise();

        var group = new Group();
        if (result["message"] == "ok") {
            group.id = modGroup["push_device_id"];
            group.push_action = modGroup["push_action"];

            return group;
        }
        return null;

    }
}
