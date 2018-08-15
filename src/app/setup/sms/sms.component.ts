import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SetupService } from 'app/service/setup.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { AlertComponent } from 'app/dialog/alert/alert.component';
import * as Globals from 'app/globals';
import { BaseComponent, BaseClassComponent } from '../../shared/base-class-component';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent extends BaseClassComponent implements OnInit, BaseComponent {

  comPort: FormControl;  
  enable: FormControl;
  myform: FormGroup;

  constructor(private setupService: SetupService, dialogService: DialogService, translateService: TranslateService) {
    super(dialogService, translateService);
    //instantiate empty form
    this.createFormControls({});
    this.createForm();
  }

  async ngOnInit() {
    //wait to get setting from server
    let setting = await this.setupService.getServerSettings();
    if (setting) {
      this.createFormControls(setting.sms);
      this.createForm();
    }
  }
  createForm() {
    this.myform = new FormGroup({
      enable: this.enable,      
      comPort: this.comPort
    });
  }
  async save() {
    var formData = this.myform.value;
    console.log("sms save setting", formData);
    let result = await this.setupService.modifyServerSettings({ data: { sms: formData } });
    console.log("sms save setting result: ", result);
    let message = (result) ? "SMS has been updated" : "SMS Settings update has been failed";
    this.showAlert(message, "Save setting result");
  }
  createFormControls(data: any) {
    this.enable = new FormControl(data.enable, [
      
    ]);


    this.comPort = new FormControl(data.comPort, [
      Validators.required,
      Validators.pattern(Globals.numberRegex)
    ]);
  }

}
