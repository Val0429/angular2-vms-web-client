import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';


import { SetupService } from 'app/service/setup.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { AlertComponent } from 'app/dialog/alert/alert.component';
import * as Globals from 'app/globals';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
  

export class EmailComponent implements OnInit {
  securityOption: string[] = [ "None", "SMTP", "TLS", "SSL"];
  port: FormControl;
  password: FormControl;
  ip: FormControl;
  account: FormControl;
  security: FormControl;
  myform: FormGroup;
  constructor(private setupService: SetupService, private dialogService: DialogService) {
    //instantiate empty form
    this.createFormControls({});
    this.createForm();
  }

  async ngOnInit() {
    //wait to get setting from server
    let setting = await this.setupService.getServerSettings();
    if (setting) {
      this.createFormControls(setting.smtp);
      this.createForm();
    }
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
    var formData = this.myform.value;
    console.log("smtp save setting", formData);
    let result = await this.setupService.modifyServerSettings({ data: { smtp: formData } });
    console.log("smtp save setting result: ", result);
    let message = (result) ? "SMTP Settings has been updated" : "STMP Settings update has been failed";

    let disposable = this.dialogService.addDialog(AlertComponent, {
      title: "Save setting result",
      message: message
    })
      .subscribe((isConfirmed) => {
        //We get dialog result
      });
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
