import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

//import { p404Component } from './404.component';
//import { p500Component } from './500.component';
import { LoginComponent } from './login.component';
//import { RegisterComponent } from './register.component';

import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';

import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [ PagesRoutingModule, FormsModule ],
  declarations: [
    //p404Component,
    //p500Component,
    LoginComponent
    //RegisterComponent
  ],
  providers: [CoreService, LoginService]
})
export class PagesModule { }
