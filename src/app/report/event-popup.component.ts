import { Component, OnInit } from '@angular/core';
import { DialogService, DialogComponent } from 'ng2-bootstrap-modal';
import { CreateEditDialog, RecurringVisitor, Visitor, Company, KioskEvent } from '../infrastructure/interface';
import { LoginService } from '../service/login.service';
import { ConfigService } from '../service/config.service';
@Component({
  selector: 'app-event-popup',
  templateUrl: './event-popup.component.html'
})
export class EventPopupComponent extends DialogComponent<CreateEditDialog, KioskEvent> implements CreateEditDialog, OnInit {
  public title:string;
  imgUrl :string;
  data : KioskEvent;
  constructor(public dialogService: DialogService, private loginService:LoginService, private configService:ConfigService) {    
    super(dialogService);
    this.data = new KioskEvent();    
    this.imgUrl="";
   }
   public setFormData(data: KioskEvent, title: string) {
    console.log("setFormData");
    this.data = Object.assign({}, data);    
    this.title = title;    
    let token = this.loginService.getCurrentUserToken();
    
    if(this.data && this.data.image && token!=null){
      //this.imgUrl=this.configService.getCgiRoot()+"thumbnail?url="+data.image+"&size=300&sessionId="+token.sessionId;
      this.imgUrl = this.data.image;
    }
      
  }
  ngOnInit() {
  }
}
