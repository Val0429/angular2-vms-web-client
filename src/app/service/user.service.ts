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
  async getFloorList(pagingParams?:string): Promise<Floor[]> {

    var token = this.loginService.getCurrentUserToken();
    var data = [];
    var result = await this.coreService.getConfig({ path: this.uriFloorCrud, query: "?sessionId=" + token.sessionId + pagingParams }).toPromise();
    console.log(result);
    if (result && result["results"]) {
      result["results"].forEach(function (newData) {
        if (newData["objectId"])
          data.push(newData);
      });
    }
    return data;
  }
  async getKioskUsersList(pagingParams?: string): Promise<KioskUser[]> {

    var token = this.loginService.getCurrentUserToken();
    var users = [];
    var result = await this.coreService.getConfig({ path: this.uriKioskCrud, query: "?sessionId=" + token.sessionId + pagingParams }).toPromise();
    console.log(result);
    if (result && result["results"]) {
      result["results"].forEach(function (user) {
        if (user["objectId"])
          users.push(user);
      });
    }
    return users;
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
  async updateKiosk(data: KioskUser): Promise<KioskUser> {

    let token = this.loginService.getCurrentUserToken();

    let result = await this.coreService.putConfig({ path: this.uriKioskCrud + "?sessionId=" + token.sessionId, data: data }).toPromise();

    console.log("update kiosk result: ", result);

    return result;
  }
  async createKiosk(data: KioskUser): Promise<KioskUser> {

    let token = this.loginService.getCurrentUserToken();

    let result = await this.coreService.postConfig({ path: this.uriKioskCrud + "?sessionId=" + token.sessionId, data: data }).toPromise();

    console.log("create kiosk result: ", result);

    return result;

  }
  async updateFloor(data: Floor): Promise<Floor> {

    var token = this.loginService.getCurrentUserToken();

    var result = await this.coreService.putConfig({ path: this.uriFloorCrud + "?sessionId=" + token.sessionId, data: data }).toPromise();

    console.log("update floor result: ", result);

    return result;
  }
  async createFloor(data: Floor): Promise<Floor> {

    var token = this.loginService.getCurrentUserToken();

    var result = await this.coreService.postConfig({ path: this.uriFloorCrud +"?sessionId="+token.sessionId, data: data }).toPromise();

    console.log("create floor result: ", result);

    return result;

  }
  async batchUploadFloor(data: any): Promise<any> {

    let token = this.loginService.getCurrentUserToken();

    let result = await this.coreService.postConfig({ path: this.uriFloorCSVCrud + "?sessionId=" + token.sessionId, data: data }).toPromise();

    console.log("batch floor upload result: ", result);

    return result;
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
  async deleteFloor(objectId: string): Promise<Floor> {
    var token = this.loginService.getCurrentUserToken();
    var result = await this.coreService.deleteConfig({ path: this.uriFloorCrud, query: ("?sessionId=" + token.sessionId + "&objectId=" + objectId) }).toPromise();
    return result;
  }
  async deleteKiosk(objectId: string): Promise<KioskUser> {
    var token = this.loginService.getCurrentUserToken();
    var result = await this.coreService.deleteConfig({ path: this.uriKioskCrud, query: ("?sessionId=" + token.sessionId + "&objectId=" + objectId) }).toPromise();
    return result;
  }
  async deleteUser(objectId: string): Promise<User> {
      var token = this.loginService.getCurrentUserToken();
      var result = await this.coreService.deleteConfig({ path: this.uriUserCrud, query: ("?sessionId=" + token.sessionId + "&objectId=" + objectId) }).toPromise();
      return result;
  }

}
