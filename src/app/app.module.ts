import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ng2-bootstrap/dropdown';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
//import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';

// Routing Module
import { AppRoutingModule } from './app.routing';

// Form Control  FormsModule => ngForm
import { FormsModule } from '@angular/forms';

// Selection Dropdown
import { ModalModule } from 'ng2-bootstrap/modal';

//Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';

// Services
import { ServiceModule } from './service/service.module';

// Form Directive
import { PasswordValidator } from './layouts/password-validation.directive';
import { ConfirmPasswordValidator } from './layouts/confirmpassword-validation.directive';
import { TenantModule } from './tenant/tenant.module';



@NgModule({
  imports: [
    BrowserModule,
    //HttpModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    ServiceModule,
    TenantModule   
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    //SimpleLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    //AsideToggleDirective,
    PasswordValidator,
    ConfirmPasswordValidator
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
