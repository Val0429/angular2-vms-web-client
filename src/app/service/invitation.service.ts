import { Injectable } from '@angular/core';
import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { VisitorProfile } from 'app/Interface/interface';
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

    async getPurposesList(): Promise<any[]> {
        var me = this;
        var token = me.loginService.getCurrentUserToken();

        var purposes = [];
        var result = await me.coreService.getConfig({ path: this.uriPurposesList, query: "?sessionId=" + token.sessionId }).toPromise();
        console.log(result);

        for (var r of result["results"]) {
            purposes.push(r);
        }

        return purposes;
    }

    async getVisitorFromMobile(phone): Promise<Object> {
        var me = this;
        var token = me.loginService.getCurrentUserToken();

        var q = "&phone=" + phone;

        var visitor = null;
        var result = await me.coreService.getConfig({ path: this.uriVisitors, query: "?sessionId=" + token.sessionId + q }).toPromise();
        console.log(result);

        for (var r of result["results"]) {
            visitor = `{"name": "` + r.name + `", "phone": "` + r.phone + `", "email": "` + r.email + `"}` ;
            break ;
        }

        return JSON.parse(visitor);
    }

    async getInvitationList(): Promise<VisitorProfile[]> {
        var me = this;
        var token = me.loginService.getCurrentUserToken();

        var invitations = [];
        var result = await me.coreService.getConfig({ path: this.uriInvites, query: "?sessionId=" + token.sessionId }).toPromise();
        console.log(result);

        for (var r of result["results"]) {
            var vp = new VisitorProfile().fromJSON(r);
            invitations.push(vp);
        }

        return invitations;
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

        var invitations = [];
        var result = await me.coreService.getConfig({ path: this.uriInvites, query: "?sessionId=" + token.sessionId + q }).toPromise();
        console.log(result);

        for (var r of result["results"]) {
            var vp = new VisitorProfile().fromJSON(r);
            invitations.push(vp);
        }

        return invitations;
    }

    async createInvitation(data): Promise<VisitorProfile> {
        var me = this;
        var token = me.loginService.getCurrentUserToken();

        var dates = [];
        var begin = data.visitor.beginDate;
        var end = data.visitor.endDate;

        while (begin <= end) {
            var t = new Date(begin);
            t.setHours(23, 59, 59);

            dates.push(`{ "start": "` + begin.toISOString() + `", "end": "` + t.toISOString() + `" }`);
            begin.setDate(t.getDate() + 1);
        }

        var d = `{
            "visitor": {
              "name": "` + data.visitor.name + `",
              "phone": "` + data.visitor.phone + `",
              "email": "` + data.visitor.email + `"
            },
            "notify": {
              "visitor": {
                "email": ` + (data.sendBy.concat("email") ? "true" : "false") + `,
                "phone": ` + (data.sendBy.concat("sms") ? "true" : "false") + `
              }
            },
            "dates": [` + dates.join(',') + `],
            "purpose": "` + data.visitor.purpose.objectId + `"
          }` ;

        console.log(JSON.parse(d));

        var result = await me.coreService.postConfig({ path: this.uriInvites + "?sessionId=" + token.sessionId, data: JSON.parse(d) }).toPromise();
        console.log(result);

        return new VisitorProfile().fromJSON(result);
    }

    async cancelInvitation(data): Promise<VisitorProfile> {
        var me = this;
        var token = me.loginService.getCurrentUserToken();
        var objectId = data.objectId;

        var d = `{
            "cancelled": true
        }` ;

        console.log(JSON.parse(d));
        var result = await me.coreService.putConfig({ path: this.uriInvites + "?sessionId=" + token.sessionId + "&objectId=" + objectId, data: JSON.parse(d) }).toPromise();
        console.log(result);

        return result;
    }

    async preRegistration(data) {
        var me = this;
        var token = me.loginService.getCurrentUserToken();
        var objectId = data.objectId;

        var d = `{
            "image": "data:image/jpeg;base64,` + data.potrait + `"
        }` ;

        console.log(JSON.parse(d));
        var result = await me.coreService.putConfig({ path: this.uriPreRegistration + "?sessionId=" + token.sessionId + "&objectId=" + objectId, data: JSON.parse(d) }).toPromise();
        console.log(result);

        return result;
    }

}