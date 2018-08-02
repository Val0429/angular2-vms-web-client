import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { Observable } from 'rxjs/Rx';
import { User, Person, Group } from 'app/Interface/interface';
import * as Globals from '../globals';

@Injectable()
export class UserService {
  
    private uriChangePassword: string = Globals.cgiRoot + "frs/cgi/changepassword";


  private uriGetUserList: string = Globals.cgiRoot + "users";

    private uriCreateUser: string = Globals.cgiRoot + "frs/cgi/createuser";
    //private uriModifyUser: string = Globals.cgiRoot + "frs/cgi/changepassword";
    private uriDeleteUser: string = Globals.cgiRoot + "frs/cgi/deleteuser";


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
        private _coreService: CoreService,
        private _loginService: LoginService
    ) { }

    async getCurrentUser(): Promise<User> {
        return this._loginService.getCurrentUser();
    }

    async changePassword(_user: string): Promise<boolean> {
        var modUser = JSON.parse(_user);
        var currentUser = this._loginService.getCurrentUser();

        let data: string = `{"username":"` + currentUser.username + `", "password":"` + currentUser.password + `", "newpassword" : "` + modUser.newpassword + `"}`;

        var result = await this._coreService.postConfig({ path: this.uriChangePassword, data: data }).toPromise();
        console.log(result);

        if (result["message"] == "ok") {
            let newData: string = `{ "username":"` + currentUser.username + `", "password":"` + modUser.newpassowrd + `" }`;
            sessionStorage.setItem('currentUser', newData);

            return true;
        }
        else {
            return false;
        }
    }

    async getUsersList(): Promise<User[]> {
        var me = this;
        var token = this._loginService.getCurrentUserToken();

        

      var _users = [];
      var result = await this._coreService.getConfig({ path: this.uriGetUserList, query: "?sessionId="+token.sessionId }).toPromise();
        console.log(result);

        // {
        //    "message": "ok",
        //     "skip": 0,
        //     "amount": 100,
        //     "list": [
        //         {
        //             "name": "Admin",
        //             "group": "admin"
        //         }
        //     ],
        // }

        
        var list = result["results"];
        list.forEach(function (user) {
            if (user["username"])
                _users.push(user);
        });
        

        return _users;
    }

    async createUser(_user: string): Promise<User> {
        var newUser = JSON.parse(_user);
        var currentUser = this._loginService.getCurrentUser();

        let data: string = `{"username":"` + currentUser.username + `", "password":"` + currentUser.password + `", "newuser_username" : "` + newUser["username"] + `", "newuser_password" : "` + newUser["password"] + `"}`;
        console.log(data);

        var result = await this._coreService.postConfig({ path: this.uriCreateUser, data: data }).toPromise();
        console.log(result);

        if (result["message"] == "ok") {
            var user = new User();
            user.username = newUser["username"];
            user.password = newUser["password"];
            user.group = "user";

            return user;
        }
        else {
            return null;
        }

    }

    async deleteUser(_user: string): Promise<boolean> {
        var delUser = JSON.parse(_user);
        var currentUser = this._loginService.getCurrentUser();

        let data: string = `{"username":"` + currentUser.username + `", "password":"` + currentUser.password + `", "delete_username" : "` + delUser.username + `"}`;
        console.log(data);

        var result = await this._coreService.postConfig({ path: this.uriDeleteUser, data: data }).toPromise();
        console.log(result);

        if (result["message"] == "ok") {
            return true;
        }
        else {
            return false;
        }
    }


    async getGroupsList(): Promise<User[]> {
        var me = this;
        var token = this._loginService.getCurrentUserToken();

        let data: string = `{ "session_id":"` + token.sessionId + `", "page_size" : 999, "skip_pages" : 0 }`;

        var _groups = [];
        var result = await this._coreService.postConfig({ path: this.uriGetGroupList, data: data }).toPromise();
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
        var token = this._loginService.getCurrentUserToken();

        //{ "session_id":"9HLHqTTaEC", "name":"vip4", "group_info" : {"actions" : []} }
        let data: string = `{ "session_id":"` + token.sessionId + `", "name":"` + newgroup.groupname + `", "group_info" : {  "actions" : [] } }`;
        console.log(data);

        var result = await this._coreService.postConfig({ path: this.uriCreateGroup, data: data }).toPromise();
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
        var token = this._loginService.getCurrentUserToken();
        let data: string = `{"session_id":"` + token.sessionId + `","group_id_list":["` + delGroup.id + `"]}`;
        console.log(data);

        var result = await this._coreService.postConfig({ path: this.uriDeleteGroup, data: data }).toPromise();
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
        var token = this._loginService.getCurrentUserToken();

        let data: string = `{ "session_id":"` + token.sessionId + `", "page_size" : 999, "skip_pages" : 0 }`;

        var _users = [];
        var result = await this._coreService.postConfig({ path: this.uriGetPersonList, data: data }).toPromise();
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

            result = await this._coreService.postConfig({ path: this.uriGetPersonList, data: data }).toPromise();

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
        var token = this._loginService.getCurrentUserToken();

        var faceImage = newPerson["image"];
        var pos = faceImage.indexOf(";base64,");

        if (pos >= 1)
            faceImage = faceImage.substring(pos + 8);

        let data: string = `{"session_id":"` + token.sessionId + `", "person_info" : {"fullname":"` + newPerson["fullname"] + `", "employeeno":"` + newPerson["employeeno"] + `" }, "image" : "` + faceImage + `"}`;
        console.log(data);

        var result = await this._coreService.postConfig({ path: this.uriCreatePerson, data: data }).toPromise();
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
        var token = this._loginService.getCurrentUserToken();
        let data: string = `{"session_id":"` + token.sessionId + `", "person_id" : "` + modUser["id"] + `", "person_info" : {"fullname":"` + modUser["fullname"] + `", "employeeno":"` + modUser["employeeno"] + `"} }`;
        console.log(data);

        var result = await this._coreService.postConfig({ path: this.uriModifyPerson, data: data }).toPromise();
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
        var token = this._loginService.getCurrentUserToken();

        let data: string = `{"session_id":"` + token.sessionId + `", "person_id" : "` + delPerson["id"] + `"}`;
        console.log(data);

        var result = await this._coreService.postConfig({ path: this.uriDeletePerson, data: data }).toPromise();
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
        var token = this._loginService.getCurrentUserToken();

        var groups = modUser["groups"];
        var ids: string[] = [];
        for (var group of groups) {
            ids.push(`"` + group.id + `"`);
        };

        let data: string = `{"session_id":"` + token.sessionId + `", "person_id" : "` + modUser["id"] + `", "group_id_list" : [` + ids.join() + `]}`;
        console.log(data);

        var result = await this._coreService.postConfig({ path: this.uriApplyPersonToGroups, data: data }).toPromise();
        console.log(result);

        if (result["message"] == "ok") {
            return true;
        }
        else {
            return false;
        }
    }

    async getFaceByFaceId(_id: string) {
        var token = this._loginService.getCurrentUserToken();
        let data: string = `{"session_id":"` + token.sessionId + `", "face_id_number" : "` + _id + `"}`;
        console.log(data);
        var result = await this._coreService.postConfig({ path: this.uriGetFaceImage, data: data }).toPromise();

        if (result["message"] == "ok") {
            return result["image"]
        }
        else {
            return null;
        }
    }


    getSnapshotByFaceId(_id: string) {
        var token = this._loginService.getCurrentUserToken();
        var uri = this.uriGetFaceSnapshot.replace("{0}", token.sessionId).replace("{1}", _id);
        console.log(uri);

        return uri ;        
    }

    async getBase64ByFaceId(_id: string) {
        var token = this._loginService.getCurrentUserToken();
        var uri = this.uriGetFaceSnapshot.replace("{0}", token.sessionId).replace("{1}", _id);
        //var uri = _id ;
        console.log(uri);

        var result = await this._coreService.getImage({ path: uri }).toPromise();

        if (result["message"] == "ok") {
            return result["image"];
        }
        else {
            return null;
        }
    }
}
