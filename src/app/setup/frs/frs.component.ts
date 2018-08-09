import { Component, OnInit } from '@angular/core';
import { SetupService } from '../../service/setup.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogService } from 'ng2-bootstrap-modal';
import { AlertComponent } from 'app/dialog/alert/alert.component';

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
  constructor(private setupService: SetupService, private dialogService:DialogService) {
    //instantiate empty form
    this.createFormControls({});
    this.createForm();
  }

  async ngOnInit() {
    //wait to get setting from server
    let setting = await this.setupService.getServerSettings();
    if (setting) {
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
    var formData = this.myform.value;
    console.log("frs save setting", formData);
    let result = await this.setupService.modifyServerSettings({ data: { frs: formData } });
    console.log("frs save setting result: ", result);
    let message = (result) ? "Settings has been updated" : "FRS Settings update has been failed";    

    let disposable = this.dialogService.addDialog(AlertComponent, {
      title: "Save setting result",
      message: message
    })
      .subscribe((isConfirmed) => {
        //We get dialog result
      });
  }
  createFormControls(data:any) {
    this.account = new FormControl(data.account, [
      Validators.required,
      Validators.minLength(3)
    ]);

    this.ip = new FormControl(data.ip, [
      Validators.required,
      Validators.pattern("^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)+$")
    ]);

    this.password = new FormControl(data.password, [
      Validators.required,
      Validators.minLength(6)
    ]);    

    this.wsport = new FormControl(data.port, [
      Validators.required,
      Validators.pattern("^[0-9]+$")
    ]);
  }
}
