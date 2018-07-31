import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
import { NgForm } from '@angular/forms';
import { UserService } from 'app/service/user.service';
//import { Group } from 'app/Interface/interface';


@Component({
  templateUrl: 'group.component.html',
  encapsulation: ViewEncapsulation.None,
  // styles: [`
  //   .form-control-file {
  //     -ms-flex: 1 1 auto;
  //   }
  //   .image {
  //     width: 150px;
  //     min-width: 150px;
  //     max-width: 150px;
  //     height: 150px;
  //     min-height: 150px;
  //     max-height: 150px;
  //    }
  // `]

})

export class GroupComponent {
  public data = [];

  model: {
    "title"?: string, "action": string, "id"?: string, "groupname"?: string, "buttom"?: string
  } =
  {
    "title": "New Group",
    "action": "New",
    "id": "0000",
    "groupname": "Group Name",
    "buttom": "Create Group"
  };

  constructor(private _userService: UserService) {
    var me = this;
    setTimeout(async () => {
      let groups = await this._userService.getGroupsList();

      // {
      //   "name": "vip2",
      //   "group_info": {
      //     "actions": [],
      //   },
      //   "group_id": "5ad6f2d91cd2a813bd2b3730"
      // },

      for (var group of groups) {
        me.data.push(JSON.parse(`
          {"id" : "` + group["group_id"] + `", 
           "groupname" : "` + group["name"] + `"}
        `));
      }
    }, 1000);

    (<HTMLInputElement>window.document.getElementById('imageInput'))
  }
  
  // trackByGroups(index: number, group: Group): String {
  //   return group.id;
  // }

  newGroup() {
    this.model.title = "New Group";
    this.model.action = "New";
    this.model.id = "";
    this.model.groupname = "Group Name";
    this.model.buttom = "Create Group";
  }

  modifyGroup(item) {
    this.model.title = "Modify Group";
    this.model.action = "Modify";
    this.model.id = item.id;
    this.model.groupname = item.groupname;
    this.model.buttom = "Save";
  }

  async deleteGroup(item) {
    this.model.id = item.id;

    var result = await this._userService.deleteGroup(JSON.stringify(this.model));

    var index = this.data.indexOf(item, 0);
    if (index > -1) {
      this.data.splice(index, 1);
    }
  }

  onFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log('form submit');

    this.saveGroup();
  }

  async saveGroup() {
    if (this.model.action == "New") {
      // Create User
      var result = await this._userService.createGroup(JSON.stringify(this.model));
      if (result != null)
        this.data.push(result);
    }
    // else if (this.model.action == "Modify") {
    //   // Modify User
    //   var mResult = await this._userService.modifyGroup(JSON.stringify(this.model));
    // }
  }
}