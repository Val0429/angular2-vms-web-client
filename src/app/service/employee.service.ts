import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { Employee, CrudInterface } from 'app/infrastructure/interface';
import { CrudService } from './crud.service';
import { ConfigService } from './config.service';

@Injectable()
export class EmployeeService extends CrudService<Employee> implements CrudInterface<Employee> {
  
    constructor(
        coreService: CoreService,
        loginService: LoginService,
        private configService:ConfigService
    ) { 
      super(coreService, loginService);
        this.uriCrud = this.configService.getCgiRoot() + "hikvision/tablets";
    }

 
}
