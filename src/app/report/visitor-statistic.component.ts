import { Component,  OnInit, NgZone } from '@angular/core';
import * as Globals from 'app/globals'
import { LoginService } from '../service/login.service';
import { ConfigService } from '../service/config.service';


@Component({
  selector: 'app-visitor-statistic',
  templateUrl: './visitor-statistic.component.html'
})
export class VisitorStatisticComponent implements OnInit {

  onSiteVisitor:number = 0;
  totalVisitor:number = 0;
  ws: WebSocket;

  constructor(private loginService:LoginService,
    private zone:NgZone,
    private configService:ConfigService
  ) { }

  ngOnInit() {
    // TODO: Live Queries with websocket later
    this.initVisitEventWatcher();

  }

  initVisitEventWatcher() :void{
   
    var token = this.loginService.getCurrentUserToken();
    if(token==null)return;
    this.ws = new WebSocket(this.configService.getWsRoot()+"reports/attendance?sessionId="+token.sessionId);
    
    this.ws.onmessage = (ev:MessageEvent)=>{
      this.zone.run(() => {
        let result = JSON.parse(ev.data);
        //console.log(result);
        this.onSiteVisitor = result.onSiteVisitor;
        this.totalVisitor = result.totalVisitor;
      });
    }

    this.ws.onopen =  () => {
      console.log("live visitor update connection opened");
    };    
    
  }
}
