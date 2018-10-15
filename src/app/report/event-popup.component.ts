import { Component, OnInit } from '@angular/core';
import { DialogService, DialogComponent } from 'ng2-bootstrap-modal';
import { CreateEditDialog, KioskEvent, EventInvestigation } from '../infrastructure/interface';
import { LoginService } from '../service/login.service';
import { ConfigService } from '../service/config.service';
@Component({
  selector: 'app-event-popup',
  templateUrl: './event-popup.component.html'
})
export class EventPopupComponent extends DialogComponent<CreateEditDialog, KioskEvent> implements CreateEditDialog, OnInit {
  public title:string;
  imgUrl :string;
  data : EventInvestigation;
  constructor(public dialogService: DialogService, private loginService:LoginService, private configService:ConfigService) {    
    super(dialogService);
    this.data = new EventInvestigation();    
    this.imgUrl="";
   }
   public setFormData(data: EventInvestigation) {
    console.log("setFormData");
    this.data = Object.assign({}, data);    
    this.title = data.action;    
    let token = this.loginService.getCurrentUserToken();
    
    if(this.data && this.data.image && token!=null){
      this.imgUrl=this.configService.getCgiRoot()+"thumbnail?url="+data.visitor.image+"&size=300&sessionId="+token.sessionId;
    }
      
  }
  ngOnInit() {
  }
}
