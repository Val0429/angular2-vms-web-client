import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'app/service/user.service';
import { Person } from 'app/Interface/interface';

import { SelectComponent, SelectItem } from 'ng2-select';

@Component({
  templateUrl: 'person.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .selectpicker,
    .form-control-file {
      -ms-flex: 1 1 auto;
    }
    .image {
      width: 150px;
      min-width: 150px;
      max-width: 150px;
      height: 150px;
      min-height: 150px;
      max-height: 150px;
     }

     .form-control-ng-select{
       width:100%;
     }

     .input-group .form-control {
       width:100% !important
     }
  `]

})

export class PersonComponent implements OnInit {
  @ViewChild("personForm") personForm : NgForm ;
  @ViewChild('groupSelect') groupSelection: SelectComponent;


  public data = [];
  public personGroups: Array<object> = [];

  model: {
    "title"?: string, "action": string, "id"?: string, "employeeno"?: string, "fullname"?: string, "groups"?: any[], "image"?: string, "buttom"?: string
  } =
  {
    "title": "New Person",
    "action": "New",
    "id": "0000",
    "employeeno": "employee No",
    "fullname": "fullname Name",
    "groups": [],
    "image": "#",
    "buttom": "Create Person"
  };

  constructor(private _userService: UserService) {
  }

  async ngOnInit() {
    var me = this;
    let groups = await this._userService.getGroupsList();
    // {
    //   "name": "vip2",
    //   "group_info": {
    //     "actions": [],
    //   },
    //   "group_id": "5ad6f2d91cd2a813bd2b3730"
    // },
    for (var group of groups) {
      me.personGroups = [...me.personGroups, { id: group["group_id"], text: group["name"] }];
    }

    let users = await this._userService.getPersonsList();
    // {
    //       "person_info": {
    //           "fullname": "ken",
    //           "employeeno": "123412"
    //       },
    //       "face_id_numbers": [
    //            "JUHllXPS3l"
    //       ],
    //       "person_id": "5ad6f3181cd2a813bd2b3771",
    //       "groups": [
    //           { 
    //               "name": "vip1",
    //               "group_id": "5ad6e0b103d9056b5eb8b60e"
    //           }
    //       ]
    // }    
    for (var user of users) {
      var ids = user["face_id_numbers"];
      let image = await this._userService.getFaceByFaceId(ids[0]);

      var person = JSON.parse(`
          { "id" : "` + user["person_id"] + `", 
            "employeeno" : "` + user["person_info"]["employeeno"] + `",  
            "fullname" : "` + user["person_info"]["fullname"] + `",  
            "image": "` + image + `"
          }
        `);

      //this.deletePerson(person) ;

      var gs = "";
      for (let k = 0; k < user["groups"].length; k++) {
        if (gs != "") gs += ",";
        gs += `{"text": "` + user["groups"][k]["name"] + `", "id": "` + user["groups"][k]["id"] + `"}`
      }

      person.groups = JSON.parse(`[` + gs + `]`);
      me.data.push(person);
    }
  }

  public group_names(_groups: any[]): string[] {
    var names: string[] = [];

    _groups.forEach(function (value) {
      names.push(value["text"]);
    });
    return names;
  }

  imageListener($event): void {
    var file: File = $event.target.files[0];
    if (file == null) return;
    
    if (file.size > 1024000) {
      alert('bigger then limitation size');
      return;
    }

    var myReader: FileReader = new FileReader();

    myReader.onloadend = async (e) => {
      // var size = 300 ;
      var image = new Image(); 
      // image.onload = await function(){ 
      //   var canvas = document.createElement("canvas"); 

      //   if(image.width > size) { 
      //     image.height *= size / image.width; 
      //     image.width = size; 
      //   }

      //   if(image.height > size) { 
      //     image.width *= size / image.height; 
      //     image.height = size; 
      //   } 

      //   var ctx = canvas.getContext("2d"); 
      //   ctx.clearRect(0, 0, canvas.width, canvas.height); 
      //   canvas.width = image.width; 
      //   canvas.height = image.height; 
      //   ctx.drawImage(image, 0, 0, image.width, image.height); 
      //   canvas.toDataURL("image/jpeg"); 
      // }; 
      image.src = myReader.result; 

      var pos = image.src.indexOf(";base64,");
      if (pos >= 0) {
        this.model.image = image.src.substring(pos + 8);
      }
    }
    myReader.readAsDataURL(file);
  }

  trackByPersons(index: number, person: Person) {
    return person.id;
  }

  showImage() {
    return !this.model.image;
  }


  newPerson() {
    this.personForm.form.reset();

    this.model.title = "New Person";
    this.model.action = "New";
    this.model.id = "";
    this.model.employeeno = "Employee No";
    this.model.fullname = "Full Name";
    this.model.image = "#";
    this.model.groups = [];
    this.model.buttom = "Create Person";

    (<HTMLInputElement>window.document.getElementById('imageInput')).value = "";
  }

  modifyPerson(item) {
    this.model.title = "Modify Person";
    this.model.action = "Modify";
    this.model.id = item.id;
    this.model.employeeno = item.employeeno;
    this.model.fullname = item.fullname;
    this.model.image = item.image;
    this.model.groups = item.groups;
    this.model.buttom = "Save";

    (<HTMLInputElement>window.document.getElementById('imageInput')).value = "";
  }

  async deletePerson(item) {
    this.model.id = item.id;

    var result = await this._userService.deletePerson(JSON.stringify(this.model));

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

    this.savePerson();
  }

  async savePerson() {
    var me = this;
    var result: Person = null;
    if (this.model.action == "New") {
      // Create User
      result = await this._userService.createPerson(JSON.stringify(this.model));
      if (result != null) {
        this.model.id = result.id;
        var person = JSON.parse(`
          { "id" : "` + result.id + `",
            "employeeno" : "` + this.model.employeeno + `",   
            "fullname" : "` + this.model.fullname + `",  
            "image": "` + this.model.image + `"
          }
        `);

        person.groups = this.model.groups;
        this.data.push(person);
      }

      if ((result != null) && (this.model.groups.length >= 1)) {
        var m2Result = await this._userService.applypersontogroups(JSON.stringify(this.model));
        console.log(m2Result);
      }
    }
    else if (this.model.action == "Modify") {
      // Modify User
      console.log(JSON.stringify(this.model));
      result = await this._userService.modifyPerson(JSON.stringify(this.model));

      if (result != null) {
        var m2Result = await this._userService.applypersontogroups(JSON.stringify(this.model));
        console.log(m2Result);
      }

      this.data.forEach(function (person) {
        if (person.id == me.model.id) {
          person.employeeno = me.model.employeeno;
          person.fullname = me.model.fullname;
          person.groups = me.model.groups;
        }
      });
    }
  }


  public selected(value: any): void {
    console.log('Selected value is: ', value);
  }

  public removed(value: any): void {
    console.log('Removed value is: ', value);
  }

  // public refreshValue(value: any): void {
  //   //this.value = value;
  // }
}