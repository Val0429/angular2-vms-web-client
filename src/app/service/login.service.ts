import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { CoreService } from 'app/service/core.service';
import { Observable } from 'rxjs/Rx';
import { SessionToken, User } from 'app/Interface/interface';
import { promise } from 'selenium-webdriver';
import * as Globals from '../globals';
import * as Defaults from '../defaults';

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
    var rememberMe = localStorage.getItem(Defaults.rememberMe);
    var currentUserToken = sessionStorage.getItem(Defaults.currentUserToken);
    if (rememberMe || currentUserToken) {
      //checks whether this token already stored in local storage but not in session storage
      if (!currentUserToken && rememberMe) {
        sessionStorage.setItem(Defaults.currentUserToken, rememberMe);
      }
      return true;
    }
    return false;
  }
  canActivate() {
    var result = this.checkActiveSession();
    console.log("can activate result:  ", result);
    return result;
  }

  async logInByPassword(_data: any): Promise<boolean> {
    let me = this;
    let user = JSON.parse(_data);
    let data: string = `{ "username":"` + user["username"] + `", "password":"` + user["password"] + `" }`;

    var ret: boolean = false;
    console.log("logInByPassword");
    console.log(data);
    await this._coreService.postConfig({ path: this.uriLogin, data: data })
      .do(
        function (result) {
          // result Handle
          var sessionToken = new SessionToken().fromJSON(result);
          //adds username to session token object
          sessionToken.username = user["username"];
          sessionStorage.setItem(Defaults.currentUserToken, JSON.stringify(sessionToken));

          ret = true;
        },
        function (err) {
          ret = false;
        },
        function () {
          ret = true;
        }
      ).toPromise()
      .catch(err => {
        console.log(err);
      });

    return ret;
  }


  getCurrentUserToken(): SessionToken {
    var item = sessionStorage.getItem(Defaults.currentUserToken);
    if (item && item !== null) {
      var sessionToken = new SessionToken().fromJSON(JSON.parse(item));

      return sessionToken;
    }
    else return null;
  }

  getCurrentUser(): User {
    var sessionToken = this.getCurrentUserToken();
    if (sessionToken && sessionToken !== null) {
      var currentUser = new User();
      currentUser.username = sessionToken.username;
      currentUser.password = "";
      return currentUser;
    }
    else return null;
  }
  async logOut(): Promise<boolean> {
    var currentUserToken = this.getCurrentUserToken();
    if (currentUserToken !== null) {
      var sessionId = currentUserToken.sessionId;
      var data = `{"sessionId":"` + sessionId + `"}`;

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
        //clears data on local storage and session
        localStorage.clear();
        sessionStorage.clear();
        }).toPromise()
        .catch(err => {
          console.log(err);
        });      
    }
    
    
    return ret;
  }
}
