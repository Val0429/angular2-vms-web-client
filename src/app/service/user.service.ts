import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { User, RoleEnum, UserServiceInterface } from 'app/infrastructure/interface';
import { CrudService } from './crud.service';
import { ConfigService } from './config.service';

@Injectable()
export class UserService extends CrudService<User> implements UserServiceInterface<User>{
  uriRoleCrud: string;
    constructor(
        coreService: CoreService,
        loginService: LoginService,
        private configService:ConfigService
    ) { 
      super(coreService, loginService);
      this.uriCrud = this.configService.getCgiRoot() + "users";
      this.uriRoleCrud = this.configService.getCgiRoot() + "roles";
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
    var token = this.loginService.getCurrentUserToken();

    var roles = [];
    var result = await this.coreService.getConfig({ path: this.uriRoleCrud, query: "?sessionId=" + token.sessionId }).toPromise();
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
