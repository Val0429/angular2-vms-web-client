import { NgModule } from "@angular/core";
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from "ng2-translate";
import { Http } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTableModule } from "angular2-datatable";
import { RouterTestingModule } from "@angular/router/testing";
import { ChartsModule } from "ng2-charts";
import { DatepickerModule } from "ng2-bootstrap";
import { ServiceModule } from "./service/service.module";
import { NgProgress } from "ngx-progressbar";
import { ConfigService, ConfigServiceStub } from "./service/config.service";


@NgModule({
  imports: [
    TranslateModule.forRoot({
    provide: TranslateLoader,
    useFactory: (http: Http) => new TranslateStaticLoader(http, '../assets/i18n/', '.json'),
    deps: [Http]
    }),
    FormsModule,
    DataTableModule,
    RouterTestingModule,
    ReactiveFormsModule,
    ChartsModule,
    DatepickerModule.forRoot(),
    ServiceModule
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
  providers:[
    {
      provide: ConfigService, 
      useClass: ConfigServiceStub
    },
    NgProgress
  ]
})
export class AppTestModule {  }
