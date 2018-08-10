import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { CoreService } from 'app/service/core.service';
import { Observable } from 'rxjs/Rx';
import { SessionToken, User } from 'app/Interface/interface';
import { promise } from 'selenium-webdriver';
import * as Globals from '../globals';


@Injectable()
export class LoginService implements CanActivate {

  //private webRoot: string = "http://172.16.10.88:8088/";
  //private webRoot: string = "http://203.69.170.41:8088/";
  //private webRoot: string = document.location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/';

  private uriLogin: string = Globals.cgiRoot + "users/login";
  private uriLogout: string = Globals.cgiRoot + "users/logout";

  constructor(
    private _router: Router,
    private _coreService: CoreService,
  ) {

  }
  checkActiveSession(): boolean {
    //TODO: improve this active session check
    var rememberMe = localStorage.getItem(Globals.rememberMe);
    var currentUserToken = sessionStorage.getItem(Globals.currentUserToken);
    if (rememberMe || currentUserToken) {
      //checks whether this token already stored in local storage but not in session storage
      if (!currentUserToken && rememberMe) {
        sessionStorage.setItem(Globals.currentUserToken, rememberMe);
      }
      return true;
    }
    return false;
  }
  canActivate() {
    var result = this.checkActiveSession();
    console.log("can activate result:  ", result);
    if (!result) {
      //redirect to login
      this._router.navigate["/login"];
    }
    return result;
  }

  async logInByPassword(data: any): Promise<boolean> {
    let me = this;
    
    var ret: boolean = false;
    console.log("logInByPassword");
    console.log(data);
    await this._coreService.postConfig({ path: this.uriLogin, data: data })
      .do(
        function (result) {
          // result Handle
          var sessionToken = result;
          sessionStorage.setItem(Globals.currentUserToken, JSON.stringify(sessionToken));

          ret = true;
        },
        function (err) {
          ret = false;
        },
        function () {
          ret = true;
        }
      ).toPromise()
      .catch(error => {
        //we don't want global error handler to redirect it to login page for unsucessful login (401)
        console.log("login error", error);
      });

    return ret;
  }


  getCurrentUserToken(): SessionToken {
    var item = sessionStorage.getItem(Globals.currentUserToken);
    if (item && item !== null) {
      var sessionToken = new SessionToken().fromJSON(JSON.parse(item));

      return sessionToken;
    }
    else return null;
  }

  getCurrentUser(): User {
    var sessionToken = this.getCurrentUserToken();
    if (sessionToken && sessionToken !== null) {
      return sessionToken.user;
    }
    else return null;
  }
  invalidateSession() {
    //clears data on local storage and session
    console.log("invalidate session");
    localStorage.clear();
    sessionStorage.clear();
  }
  async logOut(): Promise<boolean> {
    var currentUserToken = this.getCurrentUserToken();
    if (currentUserToken !== null) {
      
      let data: any = { sessionId: currentUserToken.sessionId };

      var ret: boolean = false;
      console.log("logout function call");
      console.log(data);
      await this._coreService.postConfig({ path: this.uriLogout, data: data })
        .do(
          function (result) {
            ret = true;
          },
          function (err) {
            ret = false;
            //TODO: do something with this error
          },
          function () {
            ret = true;
          }
        ).finally(() => {
          //we'd just let user logout
          ret = true;
          this.invalidateSession();
        }).toPromise();   
    }
    
    
    return ret;
  }
}
