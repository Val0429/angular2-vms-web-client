import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Rx';
import { User, Person, Group, Roles, KioskUser, Floor } from 'app/Interface/interface';
import * as Globals from '../globals';

@Injectable()
export class UserService {
  
    private uriRoleCrud: string = Globals.cgiRoot + "roles";
    private uriUserCrud: string = Globals.cgiRoot + "users";
  private uriKioskCrud: string = Globals.cgiRoot + "kiosks";
  private uriFloorCrud: string = Globals.cgiRoot + "floors";  

    private uriGetGroupList: string = Globals.cgiRoot + "frs/cgi/getgrouplist";
    private uriCreateGroup: string = Globals.cgiRoot + "frs/cgi/creategroup";
    //private uriModifyGroup: string = Globals.cgiRoot + "frs/cgi/modifygroupinfo";
    private uriDeleteGroup: string = Globals.cgiRoot + "frs/cgi/deletegroups";


    private uriGetPersonList: string = Globals.cgiRoot + "frs/cgi/getpersonlist";
    private uriCreatePerson: string = Globals.cgiRoot + "frs/cgi/createperson";
    private uriModifyPerson: string = Globals.cgiRoot + "frs/cgi/modifypersoninfo";
    private uriDeletePerson: string = Globals.cgiRoot + "frs/cgi/deleteperson";


    private uriApplyPersonToGroups: string = Globals.cgiRoot + "frs/cgi/applypersontogroups";

    private uriGetFaceImage: string = Globals.cgiRoot + "frs/cgi/getfaceimage";
    private uriGetFaceSnapshot: string = Globals.cgiRoot + "frs/cgi/snapshot/session_id={0}&image={1}";



    constructor(
        private coreService: CoreService,
        private loginService: LoginService
    ) { }

    getCurrentUser(): User {
        return this.loginService.getCurrentUser();
    }

  isAdmin(): boolean {
    var currUser = this.getCurrentUser();
    return currUser.roles.map(function (e) { return e.name }).indexOf("Administrator") > -1;
  }
  async getUserRole(): Promise<string[]> {
    var me = this;
    var token = me.loginService.getCurrentUserToken();

    var roles = [];
    var result = await me.coreService.getConfig({ path: this.uriRoleCrud, query: "?sessionId=" + token.sessionId }).toPromise();
    console.log(result);
    if (result) {
      //removes kiosk from roles (according to Val)
      var index = result.indexOf("Kiosk", 0);      
      if (index > -1) {
        result.splice(index, 1);
      }
      roles = result;
    }

    return roles;
  }
  async getFloorList(): Promise<Floor[]> {

    var token = this.loginService.getCurrentUserToken();
    var data = [];
    var result = await this.coreService.getConfig({ path: this.uriFloorCrud, query: "?sessionId=" + token.sessionId }).toPromise();
    console.log(result);
    if (result && result["results"]) {
      result["results"].forEach(function (newData) {
        if (newData["objectId"])
          data.push(newData);
      });
    }
    return data;
  }
  async getKioskUsersList(): Promise<KioskUser[]> {

    var token = this.loginService.getCurrentUserToken();
    var users = [];
    var result = await this.coreService.getConfig({ path: this.uriKioskCrud, query: "?sessionId=" + token.sessionId }).toPromise();
    console.log(result);
    if (result && result["results"]) {
      result["results"].forEach(function (user) {
        if (user["objectId"])
          users.push(user);
      });
    }
    return users;
  }
    async getUsersList(): Promise<User[]> {        

      var token = this.loginService.getCurrentUserToken();
      var users = [];
      var result = await this.coreService.getConfig({ path: this.uriUserCrud, query: "?sessionId=" + token.sessionId }).toPromise();
      console.log(result);
      if (result && result["results"]) {        
        result["results"].forEach(function (user) {
          if (user["objectId"])
            users.push(user);
        });
      }
      return users;
  }
  async updateKiosk(data: any): Promise<KioskUser> {

    var token = this.loginService.getCurrentUserToken();

    data.sessionId = token.sessionId;

    var result = await this.coreService.putConfig({ path: this.uriKioskCrud, data: data }).toPromise();

    console.log("update kiosk result: ", result);

    return result;
  }
  async createKiosk(data: any): Promise<KioskUser> {

    var token = this.loginService.getCurrentUserToken();

    data.sessionId = token.sessionId;

    var result = await this.coreService.postConfig({ path: this.uriKioskCrud, data: data }).toPromise();

    console.log("create kiosk result: ", result);

    return result;

  }
  async updateFloor(data: Floor): Promise<Floor> {

    var token = this.loginService.getCurrentUserToken();

    var result = await this.coreService.putConfig({ path: this.uriFloorCrud + "?sessionId=" + token.sessionId, data: data }).toPromise();

    console.log("update floor result: ", result);

    return result;
  }
  async createFloor(data: Floor): Promise<Floor> {

    var token = this.loginService.getCurrentUserToken();

    var result = await this.coreService.postConfig({ path: this.uriFloorCrud +"?sessionId="+token.sessionId, data: data }).toPromise();

    console.log("create floor result: ", result);

    return result;

  }
  async updateUser(data: any): Promise<User> {

    var token = this.loginService.getCurrentUserToken();
    
    data.sessionId = token.sessionId;

    var result = await this.coreService.putConfig({ path: this.uriUserCrud, data: data }).toPromise();

    console.log("update user result: ", result);
        
    return result;
  }
  async createUser(data: any): Promise<User> {
      
    var token = this.loginService.getCurrentUserToken();

    data.sessionId = token.sessionId;

    var result = await this.coreService.postConfig({ path: this.uriUserCrud, data: data }).toPromise();

    console.log("create user result: ", result);

    return result;

  }
  async deleteFloor(objectId: string): Promise<Floor> {
    var token = this.loginService.getCurrentUserToken();
    var result = await this.coreService.deleteConfig({ path: this.uriFloorCrud, query: ("?sessionId=" + token.sessionId + "&objectId=" + objectId) }).toPromise();
    return result;
  }
  async deleteKiosk(objectId: string): Promise<KioskUser> {
    var token = this.loginService.getCurrentUserToken();
    var result = await this.coreService.deleteConfig({ path: this.uriKioskCrud, query: ("?sessionId=" + token.sessionId + "&objectId=" + objectId) }).toPromise();
    return result;
  }
  async deleteUser(objectId: string): Promise<User> {
      var token = this.loginService.getCurrentUserToken();
      var result = await this.coreService.deleteConfig({ path: this.uriUserCrud, query: ("?sessionId=" + token.sessionId + "&objectId=" + objectId) }).toPromise();
      return result;
  }


    async getGroupsList(): Promise<User[]> {
        var me = this;
        var token = this.loginService.getCurrentUserToken();

        let data: string = `{ "session_id":"` + token.sessionId + `", "page_size" : 999, "skip_pages" : 0 }`;

        var _groups = [];
        var result = await this.coreService.postConfig({ path: this.uriGetGroupList, data: data }).toPromise();
        console.log(result);
        // {
        //     "message": "ok",
        //     "group_list": {
        //         "total": 4,
        //         "total_pages": 1,
        //         "page_index": 0,
        //         "page_size": 10,
        //         "groups": [
        //         {
        //             "name": "vip2",
        //             "group_info": {
        //                 "actions": [],
        //             },
        //             "group_id": "5ad6f2d91cd2a813bd2b3730"
        //         },

        if (result["message"] == "ok") {
            _groups = result["group_list"]["groups"];
        }

        return _groups;
    }

    async createGroup(_group: string): Promise<Group> {
        var newgroup = JSON.parse(_group);
        var token = this.loginService.getCurrentUserToken();

        //{ "session_id":"9HLHqTTaEC", "name":"vip4", "group_info" : {"actions" : []} }
        let data: string = `{ "session_id":"` + token.sessionId + `", "name":"` + newgroup.groupname + `", "group_info" : {  "actions" : [] } }`;
        console.log(data);

        var result = await this.coreService.postConfig({ path: this.uriCreateGroup, data: data }).toPromise();
        console.log(result);

        if (result["message"] == "ok") {

            var group = new Group();
            group.id = result["group_id"];
            group.groupname = newgroup["groupname"];

            return group;
        }
        else {
            return null;
        }

    }

    async deleteGroup(_group: string): Promise<boolean> {
        var delGroup = JSON.parse(_group);
        var token = this.loginService.getCurrentUserToken();
        let data: string = `{"session_id":"` + token.sessionId + `","group_id_list":["` + delGroup.id + `"]}`;
        console.log(data);

        var result = await this.coreService.postConfig({ path: this.uriDeleteGroup, data: data }).toPromise();
        console.log(result);

        if (result["message"] == "ok") {
            return true;
        }
        else {
            return false;
        }
    }

    async getPersonsList(): Promise<Person[]> {
        var me = this;
        var token = this.loginService.getCurrentUserToken();

        let data: string = `{ "session_id":"` + token.sessionId + `", "page_size" : 999, "skip_pages" : 0 }`;

        var _users = [];
        var result = await this.coreService.postConfig({ path: this.uriGetPersonList, data: data }).toPromise();
        console.log(result);
        // {
        // "message": "ok",
        // "person_list": {
        //     "total": 2,
        //     "total_pages": 1,
        //     "page_index": 0,
        //     "page_size": 10,
        //     "size": 2,
        //     "persons": [
        //         {
        //             "person_info": {
        //                 "fullname": "ken"
        //             },
        //             "face_id_numbers": [
        //                 "JUHllXPS3l"
        //             ],
        //             "person_id": "5ad6f3181cd2a813bd2b3771",
        //             "groups": [
        //                 { 
        //                     "name": "vip1",
        //                     "group_id": "5ad6e0b103d9056b5eb8b60e"
        //                 }
        //             ]
        //         }                        
        //     ]
        // }

        var total_pages = 0;
        if (result["message"] == "ok") {
            total_pages = result["person_list"]["total_pages"];
            _users = result["person_list"]["persons"];
        }
        console.log("getPersonsList = " + total_pages);
        for (let i = 1; i < total_pages; i++) {
            data = `{ "session_id":"` + token.sessionId + `", "page_size" : 999, "skip_pages" : ` + i + ` }`;

            result = await this.coreService.postConfig({ path: this.uriGetPersonList, data: data }).toPromise();

            if (result["message"] == "ok") {
                var lists = result["person_list"]["persons"];

                for (var item of lists) {
                    _users.push(item);
                }
            }
        }
        return _users;
    }

    async createPerson(_user: string): Promise<Person> {
        var newPerson = JSON.parse(_user);
        var token = this.loginService.getCurrentUserToken();

        var faceImage = newPerson["image"];
        var pos = faceImage.indexOf(";base64,");

        if (pos >= 1)
            faceImage = faceImage.substring(pos + 8);

        let data: string = `{"session_id":"` + token.sessionId + `", "person_info" : {"fullname":"` + newPerson["fullname"] + `", "employeeno":"` + newPerson["employeeno"] + `" }, "image" : "` + faceImage + `"}`;
        console.log(data);

        var result = await this.coreService.postConfig({ path: this.uriCreatePerson, data: data }).toPromise();
        console.log(result);

        if (result["message"] == "ok") {
            var person = new Person();
            person.id = result["person_id"];
            person.fullname = newPerson["fullname"];
            person.employeeno = newPerson["employeeno"];
            person.image = faceImage;

            return person;
        }
        else {
            var person = new Person();
            person.id = result["message"]
            return person;
        }

    }

    async modifyPerson(_newuser: string) {
        var modUser = JSON.parse(_newuser);
        var token = this.loginService.getCurrentUserToken();
        let data: string = `{"session_id":"` + token.sessionId + `", "person_id" : "` + modUser["id"] + `", "person_info" : {"fullname":"` + modUser["fullname"] + `", "employeeno":"` + modUser["employeeno"] + `"} }`;
        console.log(data);

        var result = await this.coreService.postConfig({ path: this.uriModifyPerson, data: data }).toPromise();
        console.log(result);

        var person = new Person();
        if (result["message"] == "ok") {
            person.fromJSON(modUser);

            return person;
        }
        return null;
    }

    async deletePerson(_user: string): Promise<boolean> {
        var delPerson = JSON.parse(_user);
        var token = this.loginService.getCurrentUserToken();

        let data: string = `{"session_id":"` + token.sessionId + `", "person_id" : "` + delPerson["id"] + `"}`;
        console.log(data);

        var result = await this.coreService.postConfig({ path: this.uriDeletePerson, data: data }).toPromise();
        console.log(result);

        if (result["message"] == "ok") {
            return true;
        }
        else {
            return false;
        }
    }

    async applypersontogroups(_newuser: string): Promise<boolean> {
        var modUser = JSON.parse(_newuser);
        var token = this.loginService.getCurrentUserToken();

        var groups = modUser["groups"];
        var ids: string[] = [];
        for (var group of groups) {
            ids.push(`"` + group.id + `"`);
        };

        let data: string = `{"session_id":"` + token.sessionId + `", "person_id" : "` + modUser["id"] + `", "group_id_list" : [` + ids.join() + `]}`;
        console.log(data);

        var result = await this.coreService.postConfig({ path: this.uriApplyPersonToGroups, data: data }).toPromise();
        console.log(result);

        if (result["message"] == "ok") {
            return true;
        }
        else {
            return false;
        }
    }

    async getFaceByFaceId(_id: string) {
        var token = this.loginService.getCurrentUserToken();
        let data: string = `{"session_id":"` + token.sessionId + `", "face_id_number" : "` + _id + `"}`;
        console.log(data);
        var result = await this.coreService.postConfig({ path: this.uriGetFaceImage, data: data }).toPromise();

        if (result["message"] == "ok") {
            return result["image"]
        }
        else {
            return null;
        }
    }


    getSnapshotByFaceId(_id: string) {
        var token = this.loginService.getCurrentUserToken();
        var uri = this.uriGetFaceSnapshot.replace("{0}", token.sessionId).replace("{1}", _id);
        console.log(uri);

        return uri ;        
    }

    async getBase64ByFaceId(_id: string) {
        var token = this.loginService.getCurrentUserToken();
        var uri = this.uriGetFaceSnapshot.replace("{0}", token.sessionId).replace("{1}", _id);
        //var uri = _id ;
        console.log(uri);

        var result = await this.coreService.getImage({ path: uri }).toPromise();

        if (result["message"] == "ok") {
            return result["image"];
        }
        else {
            return null;
        }
    }
}
