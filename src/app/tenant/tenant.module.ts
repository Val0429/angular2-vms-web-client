import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantRoutingModule } from './tenant-routing.module';
import { InvitationComponent } from './invitation.component';

@NgModule({
  imports: [
    CommonModule,
    TenantRoutingModule
  ],
  declarations: [InvitationComponent]
})
export class TenantModule { }
