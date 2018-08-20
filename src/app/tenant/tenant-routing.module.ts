import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//Service
import { LoginService } from 'app/service/login.service';
import { InvitationComponent } from './invitation/invitation.component';
import { TenantUserComponent } from './tenant-user/tenant-user.component';

const routes: Routes = [{
  path: '', data: { title: 'pageLayout.menu.tenant' },
  canActivate: [LoginService],
  children: [
    {
      path: 'invitation',
      canActivate: [LoginService],
      component: InvitationComponent,
      data: {
        title: 'pageLayout.tenant.invitation'
      }
    },
    {
      path: 'tenant-user',
      canActivate: [LoginService],
      component: TenantUserComponent,
      data: {
        title: 'pageLayout.tenant.tenantUser'
      }
    },
    {
      path: '**',
      redirectTo: 'tenant'
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})



export class TenantRoutingModule { }
