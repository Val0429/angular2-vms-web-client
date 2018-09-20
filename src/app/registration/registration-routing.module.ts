import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Service
import { LoginService } from 'app/service/login.service';

//Layouts
import { PotraitComponent } from './potrait.component';
import { SuccessComponent } from './success.component';

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
        path: 'success',
        //canActivate: [LoginService],
        component: SuccessComponent,
        data: {
          title: 'pageLayout.registration.success'
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
