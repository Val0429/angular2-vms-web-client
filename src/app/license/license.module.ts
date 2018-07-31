import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ng2-bootstrap/modal';

// DataTable
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


import { ServerComponent } from './server.component';
import { ClientComponent } from './client.component';
import { CameraComponent } from './camera.component';
// import { EmailComponent } from './email.component';
// import { NotificationComponent } from './notification.component';
// import { GroupRuleComponent } from './grouprule.component';

import { LicenseRoutingModule } from './license-routing.module';

@NgModule({
  imports: [
    LicenseRoutingModule,
    ModalModule.forRoot(),
    CommonModule,
    DataTableModule,
    FormsModule,
    HttpModule
  ],
  declarations: [ServerComponent, ClientComponent, CameraComponent ]
})
export class LicenseModule { }
