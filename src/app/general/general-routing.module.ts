import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Service
import { LoginService } from 'app/service/login.service';

//Layouts
import { NetworkComponent } from './network.component';
import { ServerComponent } from './server.component';


const routes: Routes = [
  { path: '', data: { title: 'General' },
    canActivate: [LoginService],
    children: [
      {
        path: 'server',
        canActivate: [LoginService],
        component: ServerComponent,
        data: {
          title: 'Server Setting'
        }
      },
      {
        path: 'network',
        canActivate: [LoginService],
        component: NetworkComponent,
        data: {
          title: 'Network Setting'
        }
      },
      {
        path: '**',
        redirectTo: 'network'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
