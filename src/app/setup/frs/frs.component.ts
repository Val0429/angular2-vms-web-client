import { Component, OnInit } from '@angular/core';
import { SetupService } from '../../service/setup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogService } from 'ng2-bootstrap-modal';
import { AlertComponent } from 'app/dialog/alert/alert.component';
import * as Globals from 'app/globals';
import { BaseComponent, BaseClassComponent } from '../../shared/base-class-component';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-frs',
  templateUrl: './frs.component.html',
  styleUrls: ['./frs.component.scss']
})
export class FrsComponent extends BaseClassComponent implements OnInit, BaseComponent {

  wsport: FormControl;
  password: FormControl;
  ip: FormControl;
  account: FormControl;

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
    if (setting && setting.frs) {
      this.createFormControls(setting.frs);
      this.createForm();
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
    this.loading = true;
    var formData = this.myform.value;
    console.log("frs save setting", formData);
    let result = await this.setupService.modifyServerSettings({ data: { frs: formData } });
    console.log("frs save setting result: ", result);
    let message = (result) ? this.getLocaleString("common.hasBeenUpdated") : this.getLocaleString("common.failedToUpdate");
    this.showAlert(this.getLocaleString("pageLayout.setup.frsSetting") + message);
    this.loading = false;
  }
  createFormControls(data:any) {
    this.account = new FormControl(data.account, [
      Validators.required,
      Validators.minLength(3)
    ]);

    this.ip = new FormControl(data.ip, [
      Validators.required,
      Validators.pattern(Globals.emailRegex)
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
