import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Service
import { LoginService } from 'app/service/login.service';

//Layouts
import { ServerComponent } from './server.component';
import { ClientComponent } from './client.component';
import { CameraComponent } from './camera.component';

const routes: Routes = [
  { path: '', data: { title: 'License' },
    canActivate: [LoginService],
    children: [
      {
        path: 'server',
        canActivate: [LoginService],
        component: ServerComponent,
        data: {
          title: 'Server License'
        }
      },
      {
        path: 'client',
        canActivate: [LoginService],
        component: ClientComponent,
        data: {
          title: 'Client License'
        }
      },
      {
        path: 'camera',
        canActivate: [LoginService],
        component: CameraComponent,
        data: {
          title: 'Camera License'
        }
      },
      {
        path: '**',
        redirectTo: 'server'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicenseRoutingModule { }
