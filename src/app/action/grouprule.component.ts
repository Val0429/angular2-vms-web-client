import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
import { UserService } from 'app/service/user.service';
import { ActionService } from 'app/service/action.service';
import { NotificationDevice } from '../Interface/interface';
//import { Group } from 'app/Interface/interface';

@Component({
  templateUrl: 'grouprule.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .selectpicker {
      -ms-flex: 1 1 auto;
    }
  `]

})

export class GroupRuleComponent {
  public data = [];
  public devices = [];

  model: {
    "title"?: string,
    "action": string,
    "id"?: string,
    "groupname"?: string,
    "push_action"?: {
      "push_action_interval"?: number,
      "push_action_device_list"?: NotificationDevice[]
    },
    "buttom"?: string
  } =
    {
      "title": "New Group",
      "action": "New",
      "id": "0000",
      "groupname": "Group Name",
      "push_action": {
        "push_action_interval": 30,
        "push_action_device_list": []
      },
      "buttom": "Create Group"
    };

  constructor(private _userService: UserService, private _actionService: ActionService) {
    var me = this;
    setTimeout(async () => {
      let groups = await this._userService.getGroupsList();

      for (var group of groups) {
        var group_push_action = JSON.parse(
          `{"id" : "` + group["group_id"] + `", "groupname" : "` + group["name"] + `", "push_action": {}}`
        )
        me.data.push(group_push_action);

        var data = `{"group_id": "` + group["group_id"] + `"}`;

        var push_action = await this._actionService.getGroupPushAction(data);

        if (push_action) {
          group_push_action["push_action"]["push_action_interval"] = push_action["push_action_interval"];
          group_push_action["push_action"]["push_action_device_list"] = push_action["push_action_device_list"];
        }
        else {
          group_push_action["push_action"]["push_action_interval"] = 1;
          group_push_action["push_action"]["push_action_device_list"] = [] ; 
        }
        console.log(JSON.stringify(group_push_action));        
      }


      let _devices = await this._actionService.getPushDeviceList();
      for (var device of _devices) {
        me.devices.push(JSON.parse(`{"push_device_type" : "` + device["push_device_type"] + `", "push_device_id": "` + device["push_device_id"] + `", "push_device_name": "` + device["push_device_name"] + `", "push_device_token": "` + device["push_device_token"] + `"}`));
      }
    }, 1000);
  }

  modelSelectDevice(_id, _ids): boolean {

  console.log(JSON.stringify(_ids));
  console.log(_id);  
    if (_ids["push_device_id"] == _id["push_device_id"]) {
      console.log("true");
      return true;
    }
    console.log("false");
    return false;
  }

  // newGroup() {
  //   this.model.title = "New Group";
  //   this.model.action = "New";
  //   this.model.id = "";
  //   this.model.groupname = "Group Name";
  //   this.model.buttom = "Create Group";
  // }

  modifyGroup(item) {
    this.model.title = "Modify Group";
    this.model.action = "Modify";
    this.model.id = item.id;
    this.model.groupname = item.groupname;
    this.model.push_action.push_action_interval = item.push_action.push_action_interval ;
    this.model.push_action.push_action_device_list = item.push_action.push_action_device_list ;
    this.model.buttom = "Save";

    console.log(JSON.stringify(this.model))    ;
  }

  // async deleteGroup(item) {
  //   this.model.id = item.id;

  //   var result = await this._userService.deleteGroup(JSON.stringify(this.model));

  //   var index = this.data.indexOf(item, 0);
  //   if (index > -1) {
  //     this.data.splice(index, 1);
  //   }
  // }

  async saveGroup() {
    // if (this.model.action == "New") {
    //   // Create User
    //   var result = await this._userService.createGroup(JSON.stringify(this.model));
    //   if (result != null)
    //     this.data.push(result);
    // }
    // else if (this.model.action == "Modify") {
    // Modify User
console.log(JSON.stringify(this.model))    ;
    var mResult = await this._actionService.modifyGroupPushAction(JSON.stringify(this.model));
    // }
  }
}