import { Component, OnInit } from '@angular/core';
import { SetupService } from '../../service/setup.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../service/common.service';
import { NgProgress } from 'ngx-progressbar';
import * as Globals from 'app/globals';

@Component({
  selector: 'app-sms-singapore',
  templateUrl: './sms-singapore.component.html'
})
export class SmsSingaporeComponent implements OnInit {

  
  url: FormControl;  
  enable: FormControl;
  testSms: FormControl;
  myform: FormGroup;
  username: FormControl;
  password: FormControl;

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
        this.createFormControls(setting.sgsms);
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
      url: this.url,
      username: this.username,
      password:this.password,
      testSms: this.testSms
    });
  }
  async save() {
    try{
      this.progressService.start();
      var formData = this.myform.value;
      console.log("sms save setting", formData);
      let result = await this.setupService.modifyServerSettings({ data: { sgsms: formData } });
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
    this.username = new FormControl(data.username, [
      Validators.required
    ]);
    this.password = new FormControl(data.password, [
      Validators.required
    ]);
    this.url = new FormControl(data.url, [
      Validators.required
    ]);
  }


}
