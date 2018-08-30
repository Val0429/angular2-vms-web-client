import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';
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
  ip: FormControl;
  account: FormControl;
  security: FormControl;
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
      account: this.account,
      ip: this.ip,
      password: this.password,
      port: this.port,
      security: this.security
    });
  }
  async save() {
    try{
      this.progressService.start();
      var formData = this.myform.value;
      console.log("smtp save setting", formData);
      let result = await this.setupService.modifyServerSettings({ data: { smtp: formData } });
      console.log("smtp save setting result: ", result);
      this.commonService.showAlert(this.commonService.getLocaleString("pageLayout.setup.emailSetting") + this.commonService.getLocaleString("common.hasBeenUpdated") );
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }
  createFormControls(data: any) {
    this.account = new FormControl(data.account, [
      Validators.required,
      Validators.minLength(3)
    ]);

    this.security = new FormControl(data.security, [
      Validators.required
    ]);

    this.ip = new FormControl(data.ip, [
      Validators.required,
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
