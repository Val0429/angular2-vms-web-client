import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//Service
import { LoginService } from 'app/service/login.service';
import { InvitationComponent } from './invitation/invitation.component';
import { VisitorComponent } from './visitor/visitor.component';

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
      path: 'visitor',
      canActivate: [LoginService],
      component: VisitorComponent,
      data: {
        title: 'pageLayout.tenant.visitor'
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
