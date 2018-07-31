import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'app/service/user.service';
import { Person } from 'app/Interface/interface';

import { SelectComponent, SelectItem } from 'ng2-select';

@Component({
  templateUrl: 'batchenroll.component.html',
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

export class BatchEnrollComponent implements OnInit {
  @ViewChild('groupSelect') groupSelection: SelectComponent;

  public data = [];
  public faces = [];
  public personGroups = [];
  public filterQuery = '';
  private srcUser = '';

  FileImport: {
    "importfile"?: string,
    "facefiles"?: string[]
  } =
  {
    "importfile": "",
    "facefiles": []
  };

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
  }

  public group_names(_groups: any[]): string[] {
    var names: string[] = [];

    // _groups.forEach(function (value) {
    //   names.push(value["text"]);
    // });
    return names;
  }

  showImage() {
    return !this.model.image;
  }

  fileListener($event): void {
    var me = this;

    var file: File = $event.target.files[0];
    if (file == null) return;
    if (file.size > 1024000 * 5) {
      alert('bigger then limitation size');
      return;
    }

    me.data = [];

    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      let csv: string = myReader.result;
      let allTextLines = csv.split(/\r|\n|\r/);
      let headers = allTextLines[0].split(',');
      let lines = [];

      for (let i = 1; i < allTextLines.length; i++) {
        let row = allTextLines[i].split(',');

        if (row.length === headers.length) {
          var person: Person = new Person();

          person.id = row[0]; // UID
          person.employeeno = row[1]; //EmployeeNo
          person.fullname = row[2]; //COMPLETE_NAME

          var gs = "";
          var g = row[3].split('-');  // Groups
          for (let j = 0; j < g.length; j++) {
            for (let k = 0; k < me.personGroups.length; k++) {
              if (me.personGroups[k].text.toLowerCase() == g[j].toLowerCase()) {
                if (gs != "") gs += ",";
                gs += `{"text": "` + me.personGroups[k].text + `", "id": "` + me.personGroups[k].id + `"}`
                break;
              }
            }
          }

          person.groups = JSON.parse(`[` + gs + `]`);
          person.image = "#";
          me.data.push(person);
        }
      }

      console.log(me.data.length);
    }
    myReader.readAsText(file, "UTF-8");
  }

  public loadFace: number = 0 ;
  public importFace: number = 0;
  public selectedFace: number = 0 ;

  public loadFaces: object[] = [] ;
  public async faceListener($event) {
    console.log(new Date().toLocaleTimeString() ) ;
    
    var me = this;

    this.faces = $event.target.files;

    //var loadFaces = [];
    //this.importFace = 0;
    for (let i = 0; i < this.faces.length; i++) {
      if (this.faces[i] == null) continue;

      // var uid = this.faces[i].name.replace(".jpg", "");  // 2.jpg
      var _fn = this.faces[i].name.split('.')
      var ext = _fn.splice(-1,1) ;                          // .jpg
      var uid = _fn.map(o => o).join('.') ;                 // 2

      // if (this.faces[i].size > 1024000) {
      //   alert('bigger then limitation size');
      //   return;
      // }

      var person: Person = new Person();

      person.id = uid ;
      person.employeeno = uid; //EmployeeNo
      person.fullname = uid; //COMPLETE_NAME

      person.image = "#";
      this.data.push(person);

      this.loadFaces.push({ "data": person, "face": this.faces[i] });
      this.selectedFace++ ;

      // for (let j = 0; j < this.data.length; j++) {
      //   if (this.data[j].id == uid) {
      //     loadFaces.push({ "data": this.data[j], "face": this.faces[i] });
      //     break;
      //   }
      // }
    }
  }

  public async loadImage() {
    var me = this ;

    var doJob = async (_face, resolve) => {
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
          _face.data.image = image.src.substring(pos + 8);
        }

        me.loadFace++;

        console.log(me.loadFace + " / " + me.loadFaces.length);

        resolve(true);
      }
      myReader.readAsDataURL(_face.face);
    }

    var doJobWithThrottle = async (loadFaces, throttle = 10) => {
      return new Promise((resolve) => {
        var takeOne = () => {
          var faces = loadFaces.shift();
          if (!faces) {
            resolve(true);
            return;
          }
          new Promise((resolve) => {
            doJob(faces, resolve);
          }).then(() => takeOne());
        }
        for (var i = 0; i < throttle; ++i) takeOne();
      });
    }
    await doJobWithThrottle(this.loadFaces);
  }

  private _importFile: File = null;
  private _csvContent: String = null;

  public async importPerson() {
    var me = this;
    var imList = [];

    for (let j = 0; j < this.data.length; j++) {
      if (this.data[j].image == "#") {
        this.data[j].result = "no image file";
        continue;
      }
      else {
        this.data[j].result = "";

        imList.push(this.data[j]);
      }
    }

    var doJob = async (_person, resolve) => {
      // var result = await me._userService.createPerson(JSON.stringify(_person));
       me.importFace++ ;
       var index = me.data.indexOf(_person, 0);
      // if (result.id != "") {
         if (index > -1) {
           me.data.splice(index, 1);
         }
      //   _person.id = result.id ;
      // }
      // else {
      //   me.data[index].result = result.fullname;
      // }

      resolve(true);
    }

    var doJobWithThrottle = async (_imList, throttle = 20) => {
      return new Promise((resolve) => {
        var takeOne = () => {
          var person = _imList.shift();
          if (!person) {
            resolve(true);
            return;
          }
          new Promise((resolve) => {
            doJob(person, resolve);
          }).then(() => takeOne());
        }
        for (var i = 0; i < throttle; ++i) takeOne();
      });
    }

    await doJobWithThrottle(imList);
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

    // this.groupSelection.active = [];
    // var active = [];
    // for (var group of this.model.groups) {
    //   for (var item of this.personGroups) {
    //     if (group.group_id == item.id)
    //       active.push(new SelectItem(item));
    //   }
    // }

    // this.groupSelection.active = active ;
  }

  async deletePerson(item) {
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
    // if (this.model.action == "New") {
    //   // Create User
    //   result = await this._userService.createPerson(JSON.stringify(this.model));
    //   if (result != null) {
    //     this.model.id = result.id;
    //     var person = JSON.parse(`
    //       { "id" : "` + result.id + `", 
    //         "employeeno" : "` + this.model.employeeno + `",   
    //         "fullname" : "` + this.model.fullname + `",  
    //         "image": "` + this.model.image + `"
    //       }
    //     `);

    //     person.groups = this.model.groups;
    //     this.data.push(person);
    //   }

    //   if ((result != null) && (this.model.groups.length >= 1)) {
    //     var m2Result = await this._userService.applypersontogroups(JSON.stringify(this.model));
    //     console.log(m2Result);
    //   }
    // }
    // else if (this.model.action == "Modify") {
    //   // Modify User
    //   console.log(JSON.stringify(this.model));
    //   result = await this._userService.modifyPerson(JSON.stringify(this.model));

    //   if (result != null) {
    //     var m2Result = await this._userService.applypersontogroups(JSON.stringify(this.model));
    //     console.log(m2Result);
    //   }

    //   this.data.forEach(function (person) {
    //     if (person.id == me.model.id) {
    //       person.employeeno = me.model.employeeno;
    //       person.fullname = me.model.fullname;
    //       person.groups = me.model.groups;
    //     }
    //   });
    // }
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