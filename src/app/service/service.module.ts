import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreService } from 'app/service/core.service';
import { CryptoService } from 'app/service/crypto.service';
import { CommonService } from 'app/service/common.service';
import { LoginService } from 'app/service/login.service';

import { ReportService } from 'app/service/report.service';
import { SetupService } from 'app/service/setup.service';
import { UserService } from 'app/service/user.service';
import { CompanyService } from './company.service';
import { KioskService } from './kiosk.service';
import { FloorService } from './floor.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { LicenseService } from './license.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule
  ],
  declarations: [],
  providers: [
    CoreService, 
    CryptoService, 
    LoginService, 
    ReportService, 
    SetupService, 
    UserService, 
    CompanyService,
    KioskService,
    FloorService,
    LicenseService,
    CommonService,
    DialogService
    ]
})
export class ServiceModule { }
