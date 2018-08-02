import { Injectable } from '@angular/core';
//import { Router } from '@angular/router';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Rx';
import { Group, Verify_Result } from 'app/Interface/interface';
import * as Globals from '../globals';

@Injectable()
export class ReportService {
    private uriGetVerifyResultList: string = Globals.cgiRoot + "frs/cgi/getverifyresultlist";
    private uriGetNonverifyResultList: string = Globals.cgiRoot + "frs/cgi/getnonverifyresultlist";

    private uriGetFcsSttings: string = Globals.cgiRoot + "frs/cgi/getfcssettings";

    constructor(
        private _coreService: CoreService,
        private _loginService: LoginService
    ) { }

    async getVerifyResultList(starttime: number, endtime: number): Promise<any[]> {
        var me = this;
        var token = this._loginService.getCurrentUserToken();

        // { "session_id":"jhljl9urEuLhVfUkIfQHLKyV", "page_size" : 99, "skip_pages" :0, "start_time" : 0, "end_time" : 2525453941773 }
        let data: string = `{ "session_id":"` + token.sessionId + `", "page_size" : 999, "skip_pages" : 0, "start_time" : ` + starttime + `, "end_time" : ` + endtime + ` }`;

        var _records = [];
        var result = await this._coreService.postConfig({ path: this.uriGetVerifyResultList, data: data }).toPromise();
        console.log(result);
        // {
        //     "message": "ok",
        //     "result": {
        //         "total": 7402,
        //         "total_pages": 75,
        //         "page_index": 0,
        //         "page_size": 99,
        //         "verify_results": [
        //             {...},

        var total_pages = 0;

        if (result["message"] == "ok") {
            total_pages = result["result"]["total_pages"];

            var lists = result["result"]["verify_results"];

            for (var item of lists) {
                _records.push(item);
            }
        }

        for (let i = 1; i < total_pages; i++) {
            let data: string = `{ "session_id":"` + token.sessionId + `", "page_size" : 999, "skip_pages" : ` + i + `, "start_time" : ` + starttime + `, "end_time" : ` + endtime + ` }`;

            var result = await this._coreService.postConfig({ path: this.uriGetVerifyResultList, data: data }).toPromise();

            if (result["message"] == "ok") {
                var lists = result["result"]["verify_results"];

                for (var item of lists) {
                    _records.push(item);
                }
            }
        }

        return _records;
    }

    async geNonverifyResultList(starttime: number, endtime: number): Promise<any[]> {
        var me = this;
        var token = this._loginService.getCurrentUserToken();

        // { "session_id":"jhljl9urEuLhVfUkIfQHLKyV", "page_size" : 99, "skip_pages" :0, "start_time" : 0, "end_time" : 2525453941773 }
        let data: string = `{ "session_id":"` + token.sessionId + `", "page_size" : 999, "skip_pages" : 0, "start_time" : ` + starttime + `, "end_time" : ` + endtime + ` }`;

        var _records = [];
        var result = await this._coreService.postConfig({ path: this.uriGetNonverifyResultList, data: data }).toPromise();
        console.log(result);
        // {
        //     "message": "ok",
        //     "result": {
        //         "total": 7402,
        //         "total_pages": 75,
        //         "page_index": 0,
        //         "page_size": 99,
        //         "verify_results": [
        //             {...},

        var total_pages = 0;

        if (result["message"] == "ok") {
            total_pages = result["group_list"]["total_pages"];

            var lists = result["group_list"]["verify_results"];

            for (var item of lists) {
                _records.push(item);
            }
        }

        for (let i = 1; i < total_pages; i++) {
            let data: string = `{ "session_id":"` + token.sessionId + `", "page_size" : 999, "skip_pages" : ` + i + `, "start_time" : ` + starttime + `, "end_time" : ` + endtime + ` }`;

            var result = await this._coreService.postConfig({ path: this.uriGetNonverifyResultList, data: data }).toPromise();

            if (result["message"] == "ok") {
                var lists = result["group_list"]["verify_results"];

                for (var item of lists) {
                    _records.push(item);
                }
            }
        }

        return _records;
    }

    async getFcsSttings(): Promise<any[]> {
        var me = this;
        var token = this._loginService.getCurrentUserToken();

        let data: string = `{ "session_id":"` + token.sessionId + `" }`;

        var _records = [];
        var result = await this._coreService.postConfig({ path: this.uriGetFcsSttings, data: data }).toPromise();
        console.log(result);

        // {
        //     "message": "ok",
        //     "fcs_settings": [
        //         {
        //             "video_source_sourceid": "nvr_1_1",
        //             "video_source_location": "FrontDoor",
        //             "video_source_type": "rtsp",

        if (result["message"] == "ok") {
            _records = result["fcs_settings"];
        }

        return _records;
    }

    async getVerifyResultCount(starttime: number, endtime: number): Promise<number> {
        var me = this;
        var token = this._loginService.getCurrentUserToken();

        // { "session_id":"jhljl9urEuLhVfUkIfQHLKyV", "page_size" : 99, "skip_pages" :0, "start_time" : 0, "end_time" : 2525453941773 }
        let data: string = `{ "session_id":"` + token.sessionId + `", "page_size" : 1, "skip_pages" : 0, "start_time" : ` + starttime + `, "end_time" : ` + endtime + ` }`;

        var _records = [];
        var result = await this._coreService.postConfig({ path: this.uriGetVerifyResultList, data: data }).toPromise();
        console.log(result);
        // {
        //     "message": "ok",
        //     "result": {
        //         "total": 7402,
        //         "total_pages": 75,
        //         "page_index": 0,
        //         "page_size": 99,
        //         "verify_results": [
        //             {...},

        var total = 0 ;
        if (result["message"] == "ok") {
            total = result["result"]["total"];
        }

        return total;
    }

    async getNonverifyResultCount(starttime: number, endtime: number): Promise<number> {
        var me = this;
        var token = this._loginService.getCurrentUserToken();

        // { "session_id":"jhljl9urEuLhVfUkIfQHLKyV", "page_size" : 99, "skip_pages" :0, "start_time" : 0, "end_time" : 2525453941773 }
        let data: string = `{ "session_id":"` + token.sessionId + `", "page_size" : 1, "skip_pages" : 0, "start_time" : ` + starttime + `, "end_time" : ` + endtime + ` }`;

        var _records = [];
        var result = await this._coreService.postConfig({ path: this.uriGetNonverifyResultList, data: data }).toPromise();
        console.log(result);
        // {
        //     "message": "ok",
        //     "result": {
        //         "total": 7402,
        //         "total_pages": 75,
        //         "page_index": 0,
        //         "page_size": 99,
        //         "verify_results": [
        //             {...},

        var total = 0 ;
        if (result["message"] == "ok") {
            total = result["group_list"]["total"];
        }

        return total;
    }
}
