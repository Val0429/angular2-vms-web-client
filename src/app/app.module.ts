import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { GlobalErrorHandler } from './global.error.handler';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Selection Dropdown
import { ModalModule } from 'ng2-bootstrap/modal';

//Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { ChangePasswordFormComponent } from './layouts/change-password-form.component';

// Services
import { ServiceModule } from './service/service.module';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';

//dialog 
import { ConfirmComponent } from './dialog/confirm/confirm.component';
import { AlertComponent } from './dialog/alert/alert.component';

//other modules
import { SetupModule } from './setup/setup.module';
import { TenantModule } from './tenant/tenant.module';

//multi languages
import { Http } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
//progress bar
import { NgProgressModule } from 'ngx-progressbar';


export function translateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

@NgModule({
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: translateLoader,
      deps: [Http]
    }),
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    ServiceModule,
    TenantModule,
    SetupModule,
    BootstrapModalModule,
    ReactiveFormsModule,
    NgProgressModule
  ],
  entryComponents: [
    ConfirmComponent,
    AlertComponent,
    ChangePasswordFormComponent
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    //SimpleLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    //AsideToggleDirective,    
    ConfirmComponent,
    AlertComponent,
    ChangePasswordFormComponent
  ],
  providers: [{
    provide: ErrorHandler,
    useClass: GlobalErrorHandler
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
