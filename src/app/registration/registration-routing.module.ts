import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Service
import { LoginService } from 'app/service/login.service';

//Layouts
import { PotraitComponent } from './potrait.component';
import { InvitationComponent } from './invitation.component';

const routes: Routes = [
  {
    path: '',
    data: { title: 'pageLayout.menu.registration' },
    //canActivate: [LoginService],
    children: [
      {
        path: 'potrait',
        //canActivate: [LoginService],
        component: PotraitComponent,
        data: {
          title: 'pageLayout.registration.potrait'
        }
      },
      {
        path: 'invitation',
        //canActivate: [LoginService],
        component: InvitationComponent,
        data: {
          title: 'pageLayout.registration.invitation'
        }
      },
      {
        path: '**',
        redirectTo: 'potrait'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
