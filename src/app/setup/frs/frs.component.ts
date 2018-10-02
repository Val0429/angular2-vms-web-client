import { Component, OnInit } from '@angular/core';
import { SetupService } from '../../service/setup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as Globals from 'app/globals';
import { CommonService } from '../../service/common.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-frs',
  templateUrl: './frs.component.html',
  styleUrls: ['./frs.component.scss']
})
export class FrsComponent implements OnInit {

  wsport: FormControl;
  password: FormControl;
  ip: FormControl;
  account: FormControl;

  myform: FormGroup;
  constructor(private setupService: SetupService, private commonService: CommonService, private progressService : NgProgress) {
    //instantiate empty form
    this.createFormControls({});
    this.createForm();
  }

  async ngOnInit() {
    try{
      this.progressService.start();
      //wait to get setting from server
      let setting = await this.setupService.getServerSettings();
      if (setting && setting.frs) {
        this.createFormControls(setting.frs);
        this.createForm();
      }
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }
  createForm() {
    this.myform = new FormGroup({
      account: this.account,
      ip: this.ip,
      password: this.password,
      wsport: this.wsport
    });
  }
  async save() {
    try{
      this.progressService.start();
      var formData = this.myform.value;
      console.log("frs save setting", formData);
      let result = await this.setupService.modifyServerSettings({ data: { frs: formData } });
      console.log("frs save setting result: ", result);
      this.commonService.showAlert(this.commonService.getLocaleString("pageLayout.setup.frsSetting") + this.commonService.getLocaleString("common.hasBeenUpdated")).subscribe(()=>{});
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }
  isLoading():boolean{
    return this.progressService.isStarted();
  }
  createFormControls(data:any) {
    this.account = new FormControl(data.account, [
      Validators.required,
      Validators.minLength(3)
    ]);

    this.ip = new FormControl(data.ip, [
      Validators.required,
      Validators.pattern(Globals.ipRegex)
    ]);

    this.password = new FormControl(data.password, [
      Validators.required,
      Validators.minLength(6)
    ]);    

    this.wsport = new FormControl(data.port, [
      Validators.required,
      Validators.pattern(Globals.numberRegex)
    ]);
  }
}
