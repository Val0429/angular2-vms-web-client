import { Component } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
//import { Http } from '@angular/http';
import { ActionService } from 'app/service/action.service';
//import { Router } from '@angular/router';
//import { User } from 'app/Interface/interface';

@Component({
  templateUrl: 'email.component.html'
})
export class EmailComponent {
  public data = [];


  model: {
    "title"?: string, "action": string, "buttom"?: string
    , "receiver_id"?: string, "receiver_name"?: string, "receiver_address"?: string
  } =
  {
    "title": "New Receiver",
    "action": "New",
    "receiver_id": "",
    "receiver_name": "ios",
    "receiver_address": "",
    "buttom": "Create Receiver"
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

  newReceiver() {
    this.model.title = "New Command";
    this.model.action = "New";
    this.model.receiver_id = "";
    this.model.receiver_name = "ios";
    this.model.receiver_address = "";
    this.model.buttom = "Create Command";
  }

  modifyReceiver(item, $event) {
    this.model.title = "Modify Command";
    this.model.action = "Modify";
    this.model.receiver_id = item.id;
    this.model.receiver_name = item.mode;
    this.model.receiver_address = item.device_name;
    this.model.buttom = "Save";

    $event.stopPropagation();
  }

  async deleteReceiver(item, $event) {
    this.model.receiver_id = item.id;

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