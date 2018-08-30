import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { KioskUser, CrudInterface } from 'app/Interface/interface';
import * as Globals from 'app/globals';
import { CrudService } from './crud.service';

@Injectable()
export class KioskService extends CrudService<KioskUser> implements CrudInterface<KioskUser> {   

    constructor(
        coreService: CoreService,
        loginService: LoginService
    ) { 
      super(coreService, loginService);
      this.uriCrud = Globals.cgiRoot + "kiosks";
    }


}
