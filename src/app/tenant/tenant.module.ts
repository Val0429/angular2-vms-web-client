import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantRoutingModule } from './tenant-routing.module';
import { InvitationComponent } from './invitation/invitation.component';
import { TenantUserComponent } from './tenant-user/tenant-user.component';
import { CreateEditTenantUserComponent } from './tenant-user/create-edit-tenant-user.component';

@NgModule({
  imports: [
    CommonModule,
    TenantRoutingModule
  ],
  declarations: [InvitationComponent, TenantUserComponent, CreateEditTenantUserComponent]
})
export class TenantModule { }
