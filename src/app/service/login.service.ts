import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { CoreService } from 'app/service/core.service';
import { Observable } from 'rxjs/Rx';
import { sessionToken, User } from 'app/Interface/interface';
import { promise } from 'selenium-webdriver';
import * as Globals from '../globals';

@Injectable()
export class LoginService implements CanActivate {
    //private webRoot: string = "http://172.16.10.88:8088/";
    //private webRoot: string = "http://203.69.170.41:8088/";
    //private webRoot: string = document.location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/';
    _remember : User[];

    private uriLogin: string = Globals.cgiRoot + "frs/cgi/login";
    private uriMaintainSession: string = Globals.cgiRoot + "frs/cgi/maintainsession";

    constructor(
        private _router: Router,
        private _coreService: CoreService,
    ) { 
        this._remember = JSON.parse(sessionStorage.getItem('USER_INFO'));

    }

    canActivate() {
        if (sessionStorage.getItem('currentUserToken')) {
            var me = this;
            var token = new sessionToken().fromJSON(JSON.parse(sessionStorage.getItem('currentUserToken')));
            var diff = token.expire - (new Date).getTime();

            console.log("canActivate " + token.expire + "    " + (new Date).getTime() + "   " + diff);

            if (diff >= 30000) {
                setTimeout(function () { me.maintainSession(); }, diff - 30000);
                return true;
            }
        }

        this._router.navigate(['/login']);
        return false;
    }

    async logInByPassword(_data: string): Promise<boolean> {
        let me = this;
        var user = JSON.parse(_data);
        let data: string = `{ "username":"` + user["username"] + `", "password":"` + user["password"] + `" }`;

        var ret: boolean = false;
console.log("logInByPassword");
console.log(data);
        await this._coreService.postConfig({ path: this.uriLogin, data: data })
            .do(
                function (result) {
                    // result Handle
                    var _sessionToken = new sessionToken().fromJSON(result);
                    console.log(_sessionToken);
                    // {
                    //     "message": "ok",
                    //     "session_id": "Ul3Rh7SnrB",
                    //     "servertime": 1524212623174,
                    //     "expire": 1524212923170
                    // }

                    if (_sessionToken.message == "ok") {
                        sessionStorage.setItem('currentUserToken', JSON.stringify(_sessionToken));
                        sessionStorage.setItem('currentUser', data);

                        // console.log('login ' + sessionStorage.getItem('currentUserToken'));
                        // console.log('login ' + sessionStorage.getItem('currentUser'));

                        let diff = _sessionToken.expire - _sessionToken.servertime - 30000;
                        console.log(diff);
                        setTimeout(function () { me.maintainSession(); }, diff);

                        ret = true;
                    }
                    else {
                        ret = false;
                    }
                },
                function (err) {
                    ret = false;
                },
                function () {
                    ret = true;
                }
            )
            .toPromise()
            .catch(err => {
                console.log(JSON.stringify(err));
            });

        return ret  ;
    }

    private maintainSession() {
        let me = this;
        var _sessionToken = new sessionToken().fromJSON(JSON.parse(sessionStorage.getItem('currentUserToken')));

        let data: string = `{ "session_id":"` + _sessionToken.session_id + `" }`;
        this._coreService.postConfig({ path: this.uriMaintainSession, data: data })
            .do(result => {
                console.log(result);
                // {
                //     "message": "ok",
                //     "servertime": 1524212590051,
                //     "expire": 1524212890049
                // }

                if (result["message"] == "ok") {
                    _sessionToken.servertime = +result["servertime"];
                    _sessionToken.expire = +result["expire"];
                    sessionStorage.setItem('currentUserToken', JSON.stringify(_sessionToken));

                    console.log('maintain ' + sessionStorage.getItem('currentUserToken'));

                    let diff = +result["expire"] - +result["servertime"] - 30000
                    setTimeout(function () { me.maintainSession(); }, diff);
                }
                else {
                    console.log("relogin") ;
                    var data = sessionStorage.getItem('currentUser');
                    me.logInByPassword(data) ;

                }
            }).subscribe(
                (data)=>{},
                (err) => { 
                    console.log(err) ;

                    console.log("relogin") ;
                    var data = sessionStorage.getItem('currentUser');
                    me.logInByPassword(data) ;
                }
            );
    }

    getCurrentUserToken(): sessionToken {
        var _sessionToken = new sessionToken().fromJSON(JSON.parse(sessionStorage.getItem('currentUserToken')));

        return _sessionToken;
    }

    getCurrentUser(): User {
        var _currentUser = new User().fromJSON(JSON.parse(sessionStorage.getItem('currentUser')));
        return _currentUser;
    }
}