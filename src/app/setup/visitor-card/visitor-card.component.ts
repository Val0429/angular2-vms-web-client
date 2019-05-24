import { Component, OnInit } from '@angular/core';
import { SetupService } from '../../service/setup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as Globals from 'app/globals';
import { CommonService } from '../../service/common.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-visitor-card',
  templateUrl: './visitor-card.component.html',
  styleUrls: ['./visitor-card.component.scss']
})
export class VisitorCardComponent implements OnInit {

  
  rangestart: FormControl;
  rangeend: FormControl;
  

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
      if (setting && setting.visitorcard) {
        this.createFormControls(setting.visitorcard);
        this.createForm();
      }
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }
  createForm() {
    this.myform = new FormGroup({
      rangeend: this.rangeend,      
      rangestart: this.rangestart      
    });
  }
  async save() {
    try{
      this.progressService.start();
      var formData = this.myform.value;
      console.log("save setting", formData);
      let result = await this.setupService.modifyServerSettings({ data: { visitorcard: formData } });
      console.log("setting result: ", result);
      this.commonService.showAlert(this.commonService.getLocaleString("pageLayout.setup.visitorCardSetting") + this.commonService.getLocaleString("common.hasBeenUpdated")).subscribe(()=>{});
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }
  isLoading():boolean{
    return this.progressService.isStarted();
  }
  createFormControls(data:any) {


    this.rangeend = new FormControl(data.rangeend, [
      Validators.required,
      Validators.pattern(Globals.numberRegex)
    ]);

    this.rangestart = new FormControl(data.rangestart, [
      Validators.required,
      Validators.pattern(Globals.numberRegex)
    ]);    

  }
}
