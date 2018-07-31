import { Component } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
//import { Http } from '@angular/http';
import { ActionService } from 'app/service/action.service';
//import { Router } from '@angular/router';
//import { User } from 'app/Interface/interface';

@Component({
  templateUrl: 'rtsp.component.html'
})
export class RtspComponent {
  public data = [];


  model: {
    "title"?: string, "action": string, "buttom"?: string
    , "rtsp_id"?: string, "rtsp_protocal"?: string, "rtsp_domain"?: string, "rtsp_port"?: string, "rtsp_account"?: string, "rtsp_password"?: string, "rtsp_uri"?: string
  } =
  {
    "title": "New RTSP Stream",
    "action": "New",
    "rtsp_id": "",
    "rtsp_protocal": "ios",
    "rtsp_domain": "",
    "rtsp_port": "",
    "rtsp_account": "",
    "rtsp_password": "",
    "rtsp_uri": "",
    "buttom": "Create Stream"
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

  newStream() {
    this.model.title = "New Stream";
    this.model.action = "New";
    this.model.rtsp_id = "";
    this.model.rtsp_protocal = "ios";
    this.model.rtsp_domain = "";
    this.model.rtsp_port = "";
    this.model.rtsp_account = "";
    this.model.rtsp_password = "";
    this.model.rtsp_uri = "";
    this.model.buttom = "Create Stream";
  }

  modifyStream(item, $event) {
    this.model.title = "Modify Stream";
    this.model.action = "Modify";
    this.model.rtsp_id = item.id;
    this.model.rtsp_protocal = item.mode;
    this.model.rtsp_domain = item.device_name;
    this.model.rtsp_port = "";
    this.model.rtsp_account = item.device_name;
    this.model.rtsp_password = item.device_name;
    this.model.rtsp_uri = item.device_name;
    this.model.buttom = "Save";

    $event.stopPropagation();
  }

  async deleteStream(item, $event) {
    this.model.rtsp_id = item.id;

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