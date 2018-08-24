import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { User, RoleEnum, UserServiceInterface } from 'app/Interface/interface';
import * as Globals from 'app/globals';
import { CrudService } from './crud.service';

@Injectable()
export class UserService extends CrudService<User> implements UserServiceInterface<User>{
  uriRoleCrud: string;
    constructor(
        coreService: CoreService,
        loginService: LoginService
    ) { 
      super(coreService, loginService);
      this.uriCrud = Globals.cgiRoot + "users";
      this.uriRoleCrud = Globals.cgiRoot + "roles";
    }

    getCurrentUser(): User {
        return this.loginService.getCurrentUser();
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
}
