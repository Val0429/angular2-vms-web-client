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
import { TenantUserComponent } from './tenant-user/tenant-user.component';
import { CreateEditTenantUserComponent } from './tenant-user/create-edit-tenant-user.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NG2DataTableModule,
    ModalModule.forRoot(),
    TenantRoutingModule,
    DatepickerModule.forRoot()
  ],
  declarations: [
    InvitationComponent, 
    TenantUserComponent,     
    CreateEditTenantUserComponent]
})
export class TenantModule { }
