import { Component } from '@angular/core';
import { ActionService } from 'app/service/action.service';


@Component({
  templateUrl: 'server.component.html',
  styles: [`
  .inputKey {
    width: 100px;
    margin-left:5px;
    margin-right:5px;
  }
  .form-control-file {
    -ms-flex: 1 1 auto;
  }
  `]
})
export class ServerComponent {
  public data = [];


  model: {
    "title"?: string, "action": string, "buttom"?: string
    , "file"?: string, "key"?: string
  } =
  {
    "title": "New RTSP Stream",
    "action": "New",
    "file": "",
    "key": "",
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

  newLicense() {
    this.model.title = "New License";
    this.model.action = "New";
    this.model.file = "";
    this.model.key = "";
    this.model.buttom = "Add License";
  }

  async deleteLicense(item, $event) {
    this.model.key = item.key;

    // var result = await this._actionService.deletePushDeviceList(JSON.stringify(this.model));

    // var index = this.data.indexOf(item, 0);
    // if (index > -1) {
    //   this.data.splice(index, 1);
    // }

    // $event.stopPropagation();
  }

  async saveLicense() {
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