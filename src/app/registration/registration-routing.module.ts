import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layouts
import { PotraitComponent } from './potrait.component';
import { SuccessComponent } from './success.component';

const routes: Routes = [
  {
    path: '',
    data: { title: 'pageLayout.menu.registration' },
    children: [
      {
        path: 'potrait',
        component: PotraitComponent,
        data: {
          title: 'pageLayout.registration.potrait'
        }
      },
      {
        path: 'success',
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
