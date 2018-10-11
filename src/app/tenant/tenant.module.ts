import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// DataTable
import { NG2DataTableModule } from "angular2-datatable-pagination";

// bsModel
import { ModalModule } from 'ng2-bootstrap/modal';

// Datepicker
import { DatepickerModule } from 'ng2-bootstrap/datepicker';

import { TenantRoutingModule } from './tenant-routing.module';
import { InvitationComponent } from './invitation/invitation.component';
import { TranslateModule } from 'ng2-translate';
import { NgProgressModule } from 'ngx-progressbar';
import { CreateInvitationComponent } from './invitation/create-invitation.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NG2DataTableModule,
    ModalModule.forRoot(),
    TenantRoutingModule,
    DatepickerModule.forRoot(),
    NgProgressModule
  ],
  entryComponents:[
    CreateInvitationComponent
  ],
  declarations: [
    InvitationComponent,
    CreateInvitationComponent
  ]
})
export class TenantModule { }
