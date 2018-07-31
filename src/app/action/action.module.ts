import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ng2-bootstrap/modal';

// DataTable
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


import { HttpComponent } from './http.component';
import { EmailComponent } from './email.component';
import { NotificationComponent } from './notification.component';
import { GroupRuleComponent } from './grouprule.component';

import { ActionRoutingModule } from './action-routing.module';

@NgModule({
  imports: [
    ActionRoutingModule,
    ModalModule.forRoot(),
    CommonModule,
    DataTableModule,
    FormsModule,
    HttpModule
  ],
  declarations: [HttpComponent, EmailComponent, NotificationComponent, GroupRuleComponent ]
})
export class ActionModule { }
