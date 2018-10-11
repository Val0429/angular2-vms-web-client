import { Injectable } from '@angular/core';
import { CoreService } from './core.service';
import { LoginService } from './login.service';
import { ReportStatistic, RecurringVisitor } from '../Interface/interface';
import { ConfigService } from './config.service';

@Injectable()
export class ReportService {

    private uriReport: string = this.configService.getCgiRoot() + "reports/";

    constructor(
        private coreService: CoreService,
        private loginService: LoginService,
        private configService:ConfigService
    ) { 

    }
    async getStatistic(start:Date, end:Date, kiosk:string[]): Promise<ReportStatistic[]> {
        var token = this.loginService.getCurrentUserToken();
        var result = await this.coreService.getConfig({ path: this.uriReport+"statistic?sessionId="+token.sessionId, 
            query:"&start="+this.convertDateString(start)+"&end="+this.convertDateString(end)+"&kioskIds="+kiosk.join()}).toPromise();
        return result && result.data ? result.data : [];
    }
    async getException(start:Date, end:Date, kiosk:string[]): Promise<ReportStatistic[]> {
        var token = this.loginService.getCurrentUserToken();
        var result = await this.coreService.getConfig({ path: this.uriReport+"exception?sessionId="+token.sessionId, 
            query:"&start="+this.convertDateString(start)+"&end="+this.convertDateString(end)+"&kioskIds="+kiosk.join()}).toPromise();
            return result && result.data ? result.data : [];
    }
    async getRecurringVisitors(start:Date, end:Date): Promise<RecurringVisitor[]> {
        var token = this.loginService.getCurrentUserToken();
        var result = await this.coreService.getConfig({ path: this.uriReport+"recurring?sessionId="+token.sessionId, 
            query:"&start="+this.convertDateString(start)+"&end="+this.convertDateString(end)}).toPromise();

        return result && result.data ? result.data : [];
    }
    private convertDateString(date: Date):string{
        return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    }
}
