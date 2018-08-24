import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { User, KioskUser, Floor,  RoleEnum, Company } from 'app/Interface/interface';
import * as Globals from 'app/globals';

@Injectable()
export class UserService {
  
    private uriRoleCrud: string = Globals.cgiRoot + "roles";
    private uriUserCrud: string = Globals.cgiRoot + "users";
  
    private uriKioskCrud: string = Globals.cgiRoot + "kiosks";
    private uriFloorCrud: string = Globals.cgiRoot + "floors";
    private uriFloorCSVCrud: string = Globals.cgiRoot + "floors/csv";

    constructor(
        private coreService: CoreService,
        private loginService: LoginService
    ) { }

    getCurrentUser(): User {
        return this.loginService.getCurrentUser();
    }

  isAdmin(): boolean {
    var currUser = this.getCurrentUser();
    return currUser.roles.map(function (e) { return e.name }).indexOf(RoleEnum[RoleEnum.Administrator]) > -1;
  }
  /**   
   * @param role   
   */
  userIs(role: RoleEnum): boolean {
    return this.getCurrentUser() &&
      this.getCurrentUser().roles &&
      this.getCurrentUser().roles.map(function (e) { return e.name }).indexOf(RoleEnum[role]) > -1;;
  }
  async getUserRole(): Promise<string[]> {
    var me = this;
    var token = me.loginService.getCurrentUserToken();

    var roles = [];
    var result = await me.coreService.getConfig({ path: this.uriRoleCrud, query: "?sessionId=" + token.sessionId }).toPromise();
    console.log(result);
    if (result) {
      //removes kiosk from roles (according to Val)
      var index = result.indexOf(RoleEnum[RoleEnum.Kiosk], 0);      
      if (index > -1) {
        result.splice(index, 1);
      }
      roles = result;
    }

    return roles;
  }
  async getUsersList(pagingParams?: string): Promise<User[]> {        

      var token = this.loginService.getCurrentUserToken();
    var users = [];
    var result = await this.coreService.getConfig({ path: this.uriUserCrud, query: "?sessionId=" + token.sessionId + pagingParams }).toPromise();
      console.log(result);
      if (result && result["results"]) {        
        result["results"].forEach(function (user) {
          if (user["objectId"])
            users.push(user);
        });
      }
      return users;
  }
  async updateUser(data: User): Promise<User> {

    let token = this.loginService.getCurrentUserToken();
    
    let result = await this.coreService.putConfig({ path: this.uriUserCrud + "?sessionId=" + token.sessionId, data: data }).toPromise();

    console.log("update user result: ", result);
        
    return result;
  }
  async createUser(userData: User): Promise<User> {
      
    let token = this.loginService.getCurrentUserToken();

    let result = await this.coreService.postConfig({ path: this.uriUserCrud + "?sessionId=" + token.sessionId, data: userData }).toPromise();

    console.log("create user result: ", result);

    return result;

  }
  async deleteUser(objectId: string): Promise<User> {
      var token = this.loginService.getCurrentUserToken();
      var result = await this.coreService.deleteConfig({ path: this.uriUserCrud, query: ("?sessionId=" + token.sessionId + "&objectId=" + objectId) }).toPromise();
      return result;
  }

}
