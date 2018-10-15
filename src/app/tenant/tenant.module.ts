import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// DataTable
import { DataTableModule } from 'angular2-datatable';

// bsModel
import { ModalModule } from 'ng2-bootstrap/modal';

// Datepicker
import { DatepickerModule } from 'ng2-bootstrap/datepicker';

import { TenantRoutingModule } from './tenant-routing.module';
import { InvitationComponent } from './invitation/invitation.component';
import { TranslateModule } from 'ng2-translate';
import { NgProgressModule } from 'ngx-progressbar';
import { CreateInvitationComponent } from './invitation/create-invitation.component';
import { VisitorComponent } from './visitor/visitor.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    DataTableModule,
    ModalModule.forRoot(),
    TenantRoutingModule,
    DatepickerModule.forRoot(),
    ReactiveFormsModule,  
    NgProgressModule
  ],
  entryComponents:[
    CreateInvitationComponent
  ],
  declarations: [
    InvitationComponent,
    CreateInvitationComponent,
    VisitorComponent
  ]
})
export class TenantModule { }
