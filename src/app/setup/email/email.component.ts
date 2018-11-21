import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SetupService } from 'app/service/setup.service';
import * as Globals from 'app/globals';
import { CommonService } from '../../service/common.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
  

export class EmailComponent  implements OnInit {
  securityOption: string[] = [ "None", "TLS", "SSL"];
  port: FormControl;
  password: FormControl;
  host: FormControl;
  testEmail: FormControl;
  email: FormControl;
  enable: FormControl;
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
      if (setting && setting.smtp) {
        this.createFormControls(setting.smtp);
        this.createForm();
      }
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }
  isLoading():boolean{
    return this.progressService.isStarted();
  }
  createForm() {
    this.myform = new FormGroup({
      email: this.email,
      testEmail: this.testEmail,
      host: this.host,
      password: this.password,
      port: this.port,
      enable: this.enable
    });
  }
  async save() {
    try{
      this.progressService.start();
      var formData = this.myform.value;
      console.log("smtp save setting", formData);
      let result = await this.setupService.modifyServerSettings({ data: { smtp: formData } });
      console.log("smtp save setting result: ", result);
      this.commonService.showAlert(this.commonService.getLocaleString("pageLayout.setup.emailSetting") + this.commonService.getLocaleString("common.hasBeenUpdated") ).subscribe(()=>{});
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }
  async sendTestEmail(){
    try{
      this.progressService.start();
      let result = await this.setupService.sendTestEmail(this.testEmail.value);
      console.log("smtp test result: ", result);
      this.commonService.showAlert(this.commonService.getLocaleString("common.email")+this.commonService.getLocaleString("common.hasBeenSent")).subscribe(()=>{});
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }
  createFormControls(data: any) {
    this.email = new FormControl(data.email, [
      Validators.required,
      Validators.minLength(3)
    ]);

    this.enable = new FormControl(data.enable, [
      //Validators.required
    ]);

    this.host = new FormControl(data.host, [
      Validators.required
      
    ]);

    this.testEmail = new FormControl('',[       
      Validators.pattern(Globals.emailRegex)
    ]);

    this.password = new FormControl(data.password, [
      Validators.required,
      Validators.minLength(6)
    ]);

    this.port = new FormControl(data.port, [
      Validators.required,
      Validators.pattern(Globals.numberRegex)
    ]);
  }
}
