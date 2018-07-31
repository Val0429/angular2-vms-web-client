import { Component } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
//import { Http } from '@angular/http';
import { ActionService } from 'app/service/action.service';
//import { Router } from '@angular/router';
//import { User } from 'app/Interface/interface';

@Component({
  templateUrl: 'notification.component.html',
  styles : [`
    .radio-inline{
      margin: 7px 15px auto 5px;
    }
  `]
})
export class NotificationComponent {
  public data = [];
  public filterQuery = '';
  private srcUser = '' ;

  model: {
    "title"?: string, "action": string, "buttom"?: string
    , "push_device_id"?: string, "push_device_type"?: string, "push_device_name"?: string, "push_device_token"?: string
  } =
  {
    "title": "New Device",
    "action": "New",
    "push_device_id": "",
    "push_device_type": "ios",
    "push_device_name": "",
    "push_device_token": "",
    "buttom": "Create Device"
  };

  constructor(private _actionService: ActionService) {
    var me = this;
    setTimeout(async () => {

      let _devices = await this._actionService.getPushDeviceList();
      for (var device of _devices) {
        me.data.push( JSON.parse(`{"push_device_type" : "` + device["push_device_type"] + `", "push_device_id": "` + device["push_device_id"] + `", "push_device_name": "` + device["push_device_name"] + `", "push_device_token": "` + device["push_device_token"] + `"}`) ) ;
      }
    }, 1000);
  }

  newDevice() {
    this.model.title = "New Device";
    this.model.action = "New";
    this.model.push_device_id = "";
    this.model.push_device_type = "ios";
    this.model.push_device_name = "";
    this.model.push_device_token = "";
    this.model.buttom = "Create Device";
  }

  modifyDevice(item, $event) {
    this.model.title = "Modify Device";
    this.model.action = "Modify";
    this.model.push_device_id = item.id;
    this.model.push_device_type = item.mode;
    this.model.push_device_name = item.device_name;
    this.model.push_device_token = item.device_token;
    this.model.buttom = "Save";

    $event.stopPropagation();
  }

  async deleteDevice(item, $event) {
    this.model.push_device_id = item.id;

    var result = await this._actionService.deletePushDeviceList(JSON.stringify(this.model));

    var index = this.data.indexOf(item, 0);
    if (index > -1) {
      this.data.splice(index, 1);
    }

    $event.stopPropagation();
  }

  async saveDevice() {
    var result = null ;
    if (this.model.action == "New") {
      // Create
      result = await this._actionService.addPushDevice(JSON.stringify(this.model));
      if (result != null) {
        this.model.push_device_id = result.id ;
        this.data.push(result);
      }
    }
    else if (this.model.action == "Modify") {
      // Modify
      result = await this._actionService.modifyDevice(JSON.stringify(this.model));
    }
  }

}