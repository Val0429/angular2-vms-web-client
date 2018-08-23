import { NgModule } from "@angular/core";
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from "ng2-translate";
import { Http } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTableModule } from "angular2-datatable";
import { RouterTestingModule } from "@angular/router/testing";
import { UserService } from "./service/user.service";
import { CoreService } from "./service/core.service";
import { LoginService } from "./service/login.service";
import { DialogService } from "ng2-bootstrap-modal";
import { SetupService } from "./service/setup.service";
import { ChartsModule } from "ng2-charts";
import { DatepickerModule } from "ng2-bootstrap";
import { ReportService } from "./service/report.service";
import { CompanyService } from "./service/company.service";

@NgModule({
  imports: [
    TranslateModule.forRoot({
    provide: TranslateLoader,
    useFactory: (http: Http) => new TranslateStaticLoader(http, '../assets/i18n', '.json'),
    deps: [Http]
    }),
    FormsModule,
    DataTableModule,
    RouterTestingModule,
    ReactiveFormsModule,
    ChartsModule,
    DatepickerModule.forRoot()
  ],
  exports: [
    TranslateModule,
    FormsModule,
    DataTableModule,
    RouterTestingModule,
    ReactiveFormsModule,
    ChartsModule,
    DatepickerModule
  ],
  providers: [UserService, CoreService, LoginService, DialogService, SetupService, ReportService, CompanyService]
})
export class AppTestModule { }
