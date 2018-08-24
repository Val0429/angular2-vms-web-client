import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { Floor, CrudInterface } from 'app/Interface/interface';
import * as Globals from 'app/globals';
import { CrudService } from './crud.service';

@Injectable()
export class FloorService extends CrudService<Floor> implements CrudInterface<Floor> {
  
     
    private uriFloorCSVCrud: string = Globals.cgiRoot + "floors/csv";

    constructor(
        coreService: CoreService,
        loginService: LoginService
    ) { 
      super(coreService, loginService);
      this.uriCrud = Globals.cgiRoot + "floors";
    }

  async batchUploadFloor(data: any): Promise<any> {

    let token = this.loginService.getCurrentUserToken();

    let result = await this.coreService.postConfig({ path: this.uriFloorCSVCrud + "?sessionId=" + token.sessionId, data: data }).toPromise();

    console.log("batch floor upload result: ", result);

    return result;
  }
}
