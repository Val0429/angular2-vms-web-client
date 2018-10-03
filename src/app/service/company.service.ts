import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { Company, CrudInterface } from 'app/Interface/interface';
import * as Globals from '../globals';
import { CrudService } from './crud.service';
import { ConfigService } from './config.service';



@Injectable()
export class CompanyService extends CrudService<Company> implements CrudInterface<Company> {
  
  constructor(
      coreService: CoreService,
      loginService:LoginService,
      private configService:ConfigService
    ) {
    super(coreService,loginService);
    this.uriCrud = this.configService.getCgiRoot() + "companies";
   }  

}
