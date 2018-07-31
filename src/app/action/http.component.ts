import { Component } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
//import { Http } from '@angular/http';
import { ActionService } from 'app/service/action.service';
//import { Router } from '@angular/router';
//import { User } from 'app/Interface/interface';

@Component({
  templateUrl: 'http.component.html',
  styles : [`
    .radio-inline{
      margin: 7px 15px auto 5px;
    }
  `]
})
export class HttpComponent {
  public data = [];


  model: {
    "title"?: string, "action": string, "buttom"?: string
    , "command_id"?: string, "command_method"?: string, "command_authtication"?: string, "command_account"?: string,"command_password"?: string, "command_url"?: string
  } =
  {
    "title": "New Device",
    "action": "New",
    "command_id": "",
    "command_method": "ios",
    "command_authtication": "",
    "command_account": "",
    "command_password": "",
    "command_url": "",
    "buttom": "Create Device"
  };

  constructor(private _actionService: ActionService) {
    var me = this;
    setTimeout(async () => {

      // let _devices = await this._actionService.getPushDeviceList();
      // for (var device of _devices) {
      //   me.data.push( JSON.parse(`{"push_device_type" : "` + device["push_device_type"] + `", "push_device_id": "` + device["push_device_id"] + `", "push_device_name": "` + device["push_device_name"] + `", "push_device_token": "` + device["push_device_token"] + `"}`) ) ;
      // }
    }, 1000);
  }

  newCommand() {
    this.model.title = "New Command";
    this.model.action = "New";
    this.model.command_id = "";
    this.model.command_method = "ios";
    this.model.command_authtication = "";
    this.model.command_account = "";
    this.model.command_password = "";
    this.model.command_url = "";
    this.model.buttom = "Create Command";
  }

  modifyCommand(item, $event) {
    this.model.title = "Modify Command";
    this.model.action = "Modify";
    this.model.command_id = item.id;
    this.model.command_method = item.mode;
    this.model.command_authtication = item.device_name;
    this.model.command_account = item.device_token;
    this.model.command_password = item.device_token;
    this.model.command_url = item.device_token;
    this.model.buttom = "Save";

    $event.stopPropagation();
  }

  async deleteCommand(item, $event) {
    this.model.command_id = item.id;

    // var result = await this._actionService.deletePushDeviceList(JSON.stringify(this.model));

    // var index = this.data.indexOf(item, 0);
    // if (index > -1) {
    //   this.data.splice(index, 1);
    // }

    // $event.stopPropagation();
  }

  async saveCommand() {
    // var result = null ;
    // if (this.model.action == "New") {
    //   // Create
    //   result = await this._actionService.addPushDevice(JSON.stringify(this.model));
    //   if (result != null) {
    //     this.model.command_id = result.id ;
    //     this.data.push(result);
    //   }
    // }
    // else if (this.model.action == "Modify") {
    //   // Modify
    //   result = await this._actionService.modifyDevice(JSON.stringify(this.model));
    // }
  }

}