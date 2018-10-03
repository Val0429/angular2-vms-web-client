import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SetupService } from 'app/service/setup.service';
import * as Globals from 'app/globals';
import {NgProgress} from 'ngx-progressbar'
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent implements OnInit {

  comPort: FormControl;  
  enable: FormControl;
  testSms: FormControl;
  myform: FormGroup;

  constructor(private setupService: SetupService, private commonService: CommonService, private progressService:NgProgress) {
    
    //instantiate empty form
    this.createFormControls({});
    this.createForm();
  }

  async ngOnInit() {
    try{
      this.progressService.start();
      //wait to get setting from server
      let setting = await this.setupService.getServerSettings();
      if (setting && setting.sms) {
        this.createFormControls(setting.sms);
        this.createForm();
      }
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }
  createForm() {
    this.myform = new FormGroup({
      enable: this.enable,      
      comPort: this.comPort,
      testSms: this.testSms
    });
  }
  async save() {
    try{
      this.progressService.start();
      var formData = this.myform.value;
      console.log("sms save setting", formData);
      let result = await this.setupService.modifyServerSettings({ data: { sms: formData } });
      console.log("sms save setting result: ", result);
      this.commonService.showAlert(this.commonService.getLocaleString("pageLayout.setup.smsSetting") + this.commonService.getLocaleString("common.hasBeenUpdated")).subscribe(()=>{});
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }
  isLoading():boolean{
    return this.progressService.isStarted();
  }
  async sendTestSms(){
    try{
      this.progressService.start();
      let result = await this.setupService.sendTestSms(this.testSms.value);
      console.log("sms test result: ", result);
      this.commonService.showAlert(this.commonService.getLocaleString("common.sms")+this.commonService.getLocaleString("common.hasBeenSent")).subscribe(()=>{});
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }
  createFormControls(data: any) {
    this.enable = new FormControl(data.enable, [
      
    ]);

    this.testSms = new FormControl('', [
      Validators.pattern(Globals.singlePhoneRegex)
    ]);

    this.comPort = new FormControl(data.comPort, [
      Validators.required
    ]);
  }

}
