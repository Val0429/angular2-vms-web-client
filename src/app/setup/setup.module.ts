import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ng2-bootstrap/modal';

//import { ChartsModule } from 'ng2-charts/ng2-charts';

// DataTable
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { DatepickerModule } from 'ng2-bootstrap';

import { NetworkComponent } from './network.component';
import { ServerComponent } from './server/server.component';

import { SetupRoutingModule } from './setup-routing.module';
import { EmailComponent } from './email/email.component';
import { SmsComponent } from './sms/sms.component';
import { KioskComponent } from './kiosk/kiosk.component';
import { FloorComponent } from './floor/floor.component';
import { AccountComponent } from './account/account.component';

@NgModule({
  imports: [
    SetupRoutingModule,
    ModalModule.forRoot(),
    CommonModule,
    DataTableModule,
    FormsModule,
    HttpModule,
//    ChartsModule,
    DatepickerModule.forRoot()
  ],
  declarations: [NetworkComponent, ServerComponent, EmailComponent, SmsComponent, KioskComponent, FloorComponent, AccountComponent]
})
export class SetupModule { }
