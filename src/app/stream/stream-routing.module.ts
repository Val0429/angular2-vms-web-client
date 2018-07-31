import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Service
import { LoginService } from 'app/service/login.service';

//Layouts
import { RtspComponent } from './rtsp.component';
// import { EmailComponent } from './email.component';
// import { NotificationComponent } from './notification.component';
// import { GroupRuleComponent } from './grouprule.component';

const routes: Routes = [
  // { path: '', redirectTo: 'manage-user', pathMatch: 'full' },
  { path: '', data: { title: 'Video' },
    canActivate: [LoginService],
    children: [
      {
        path: 'rtsp',
        canActivate: [LoginService],
        component: RtspComponent,
        data: {
          title: 'Rtsp Stream'
        }
      },
      {
        path: '**',
        redirectTo: 'rtsp'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StreamRoutingModule { }
