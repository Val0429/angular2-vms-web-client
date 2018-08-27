import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { Company, CrudInterface } from 'app/Interface/interface';
import * as Globals from '../globals';
import { CrudService } from './crud.service';



@Injectable()
export class CompanyService extends CrudService<Company> implements CrudInterface<Company> {
  
  constructor(
      coreService: CoreService,
      loginService:LoginService
    ) {
    super(coreService,loginService);
    this.uriCrud = Globals.cgiRoot + "companies";
   }  

}
