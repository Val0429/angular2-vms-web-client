import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { Invitation, Notify, InvitationDate, Purpose, Visitor } from 'app/infrastructure/interface';
import { ConfigService } from './config.service';

@Injectable()
export class InvitationService {
    private uriPurposesList: string = this.configService.getCgiRoot() + "purposes";
    private uriInvites: string =this.configService.getCgiRoot() + "visitors/invites";
    private uriVisitors: string = this.configService.getCgiRoot() + "visitors";
    private uriPreRegistration: string = this.configService.getCgiRoot() + "visitors/pre-registration" ;

    constructor(
        private coreService: CoreService,
        private loginService: LoginService,
        private configService: ConfigService
    ) { }

    async getPurposesList(): Promise<Purpose[]> {
        
        var token = this.loginService.getCurrentUserToken();
        var result = await this.coreService.getConfig({ path: this.uriPurposesList, query: "?sessionId=" + token.sessionId }).toPromise();
        console.log(result);
        return result && result.results ? result.results:[];
    }

    async getVisitorFromMobile(phone:string): Promise<Visitor> {        
        var token = this.loginService.getCurrentUserToken();
        var q = "&phone=" + phone;
        var result = await this.coreService.getConfig({ path: this.uriVisitors, query: "?sessionId=" + token.sessionId + q }).toPromise();
        console.log(result);
        return result && result.results && result.results[0] ? result.results[0] : null;
    }
    async getVisitors(query:string): Promise<Visitor[]> {        
        var token = this.loginService.getCurrentUserToken();        
        var result = await this.coreService.getConfig({ path: this.uriVisitors, query: "?sessionId=" + token.sessionId + query }).toPromise();
        console.log(result);
        return result && result.results ? result.results : [];
    }
    async getInvitationList(): Promise<Invitation[]> {
        
        var token = this.loginService.getCurrentUserToken();
        
        var result = await this.coreService.getConfig({ path: this.uriInvites, query: "?sessionId=" + token.sessionId }).toPromise();
        console.log("get result", result);
        return result && result.results ? result.results : [];
    }

    async getSearchInvitationList(condition) {
        var me = this;
        var token = me.loginService.getCurrentUserToken();

        var q = "";
        if (condition.mobileNo != "")
            q += "&phone=" + condition.mobileNo;

        if (condition.visitorName != "")
            q += "&name=" + condition.visitorName;

        if (condition.beginDatetime != "")
            q += "&start=" + condition.beginDatetime;

        if (condition.endDatetime != "")
            q += "&end=" + condition.endDatetime;

        if (condition.status != "")
            q += "&status=" + condition.status;

        
        var result = await me.coreService.getConfig({ path: this.uriInvites, query: "?sessionId=" + token.sessionId + q }).toPromise();
        console.log(result);
        
        return result && result.results ? result.results : [];
        
    }

    async createInvitation(data:Invitation, start:string, end:string): Promise<Invitation> {
        
        var token = this.loginService.getCurrentUserToken();

        data.dates = [];
        var begin = new Date(start);
        var finish = new Date(end);

        while (begin <= finish) {                        
            var t = new Date(begin);
            var newDate = new InvitationDate();
            //start of pin code validity for this day
            newDate.start = new Date(t.setHours(0, 0, 0));
            //end of pin code validity for this day       
            newDate.end = new Date(t.setHours(23, 59, 59));
            data.dates.push(newDate);            
            //next date
            begin.setDate(begin.getDate() + 1);
        }

        var result = await this.coreService.postConfig({ path: this.uriInvites + "?sessionId=" + token.sessionId, data }).toPromise();        
        console.log("new item: ", result);
        return result;
    }

    async cancelInvitation(objectId : string): Promise<Invitation> {
        var token = this.loginService.getCurrentUserToken();        
        var result = await this.coreService.putConfig({ path: this.uriInvites + "?sessionId=" + token.sessionId + "&objectId=" + objectId, data: {cancelled: true}}).toPromise();
        console.log("delete result", result);
        return result ? result : new Invitation();
    }

    async preRegistration(data) {
        var objectId = data.objectId;
        var result = await this.coreService.putConfig({ path: this.uriPreRegistration + "?objectId=" + objectId, 
            data: { image: "data:image/jpeg;base64," + data.potrait } }).toPromise();
        console.log(result);

        return result;
    }

}