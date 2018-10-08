import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { License } from 'app/Interface/interface';
import { CrudService } from './crud.service';
import { ConfigService } from './config.service';

@Injectable()
export class LicenseService extends CrudService<License>  {  
    
    constructor(
        coreService: CoreService,
        loginService: LoginService,
        private configService:ConfigService
    ) { 
      super(coreService, loginService);
      this.uriCrud = this.configService.getCgiRoot() + "license";
      
    }

}
