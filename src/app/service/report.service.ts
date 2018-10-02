import { Injectable } from '@angular/core';
import { CoreService } from './core.service';
import { LoginService } from './login.service';
import * as Globals from 'app/globals'
import { ReportStatistic, RecurringVisitor } from '../Interface/interface';

@Injectable()
export class ReportService {

    private uriReport: string = Globals.cgiRoot + "reports/";

    constructor(
        private coreService: CoreService,
        private loginService: LoginService
    ) { 

    }
    async getStatistic(start:Date, end:Date, kiosk:string[]): Promise<ReportStatistic[]> {
        var token = this.loginService.getCurrentUserToken();
        var result = await this.coreService.getConfig({ path: this.uriReport+"statistic?sessionId="+token.sessionId, 
            query:"&start="+this.convertDateString(start)+"&end="+this.convertDateString(end)+"&kioskIds="+kiosk.join()}).toPromise();
        return result.data;
    }
    async getException(start:Date, end:Date, kiosk:string[]): Promise<ReportStatistic[]> {
        var token = this.loginService.getCurrentUserToken();
        var result = await this.coreService.getConfig({ path: this.uriReport+"exception?sessionId="+token.sessionId, 
            query:"&start="+this.convertDateString(start)+"&end="+this.convertDateString(end)+"&kioskIds="+kiosk.join()}).toPromise();
        return result.data;
    }
    async getRecurringVisitors(start:Date, end:Date): Promise<RecurringVisitor[]> {
        var token = this.loginService.getCurrentUserToken();
        var result = await this.coreService.getConfig({ path: this.uriReport+"recurring?sessionId="+token.sessionId, 
            query:"&start="+this.convertDateString(start)+"&end="+this.convertDateString(end)}).toPromise();
        return result.data;
    }
    private convertDateString(date: Date):string{
        return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    }
}
