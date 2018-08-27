import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SetupService } from 'app/service/setup.service';
import { DialogService } from 'ng2-bootstrap-modal';
import * as Globals from 'app/globals';
import { TranslateService } from 'ng2-translate';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent implements OnInit {

  comPort: FormControl;  
  enable: FormControl;
  myform: FormGroup;
  loading: boolean;

  constructor(private setupService: SetupService, private commonService: CommonService) {
    
    //instantiate empty form
    this.createFormControls({});
    this.createForm();
  }

  async ngOnInit() {
    //wait to get setting from server
    let setting = await this.setupService.getServerSettings();
    if (setting && setting.sms) {
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
    this.loading = true;
    var formData = this.myform.value;
    console.log("sms save setting", formData);
    let result = await this.setupService.modifyServerSettings({ data: { sms: formData } });
    console.log("sms save setting result: ", result);
    let message = (result) ? this.commonService.getLocaleString("common.hasBeenUpdated") : this.commonService.getLocaleString("common.failedToUpdate");
    this.commonService.showAlert(this.commonService.getLocaleString("pageLayout.setup.smsSetting") + message);
    this.loading = false;
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
