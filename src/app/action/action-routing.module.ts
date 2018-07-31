import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Service
import { LoginService } from 'app/service/login.service';

//Layouts
import { HttpComponent } from './http.component';
import { EmailComponent } from './email.component';
import { NotificationComponent } from './notification.component';
import { GroupRuleComponent } from './grouprule.component';

const routes: Routes = [
  // { path: '', redirectTo: 'manage-user', pathMatch: 'full' },
  { path: '', data: { title: 'Action' },
    canActivate: [LoginService],
    children: [
      {
        path: 'http',
        canActivate: [LoginService],
        component: HttpComponent,
        data: {
          title: 'Http Commands'
        }
      },
      {
        path: 'email',
        canActivate: [LoginService],
        component: EmailComponent,
        data: {
          title: 'Email Receivers'
        }
      },
      {
        path: 'notification',
        canActivate: [LoginService],
        component: NotificationComponent,
        data: {
          title: 'Notification Devices'
        }
      },
      {
        path: 'grouprule',
        canActivate: [LoginService],
        component: GroupRuleComponent,
        data: {
          title: 'Group Action'
        }
      }
      ,
      {
        path: '**',
        redirectTo: 'notification'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionRoutingModule { }
