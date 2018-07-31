import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ng2-bootstrap/modal';

// DataTable
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


import { RtspComponent } from './rtsp.component';
// import { EmailComponent } from './email.component';
// import { NotificationComponent } from './notification.component';
// import { GroupRuleComponent } from './grouprule.component';

import { StreamRoutingModule } from './stream-routing.module';

@NgModule({
  imports: [
    StreamRoutingModule,
    ModalModule.forRoot(),
    CommonModule,
    DataTableModule,
    FormsModule,
    HttpModule
  ],
  declarations: [RtspComponent ]
})
export class StreamModule { }
