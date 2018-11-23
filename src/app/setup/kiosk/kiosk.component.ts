import { Component, OnInit, NgZone } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { CreateEditKioskComponent } from './create-edit-kiosk.component';
import { ConfirmComponent } from 'app/dialog/confirm/confirm.component';
import { KioskUser, KioskData, Role, RoleEnum } from '../../infrastructure/interface';
import { KioskService } from '../../service/kiosk.service';
import { UserService } from '../../service/user.service';
import { CommonService } from '../../service/common.service';
import { NgProgress } from 'ngx-progressbar';
import { LoginService } from 'app/service/login.service';
import { ConfigService } from 'app/service/config.service';

@Component({
  selector: 'app-kiosk',
  templateUrl: './kiosk.component.html',
  styleUrls: ['./kiosk.component.scss']
})
export class KioskComponent implements OnInit{


  constructor(
    private kioskService: KioskService, 
    private userService: UserService, 
    private commonService: CommonService, 
    private dialogService:DialogService,
    private progressService:NgProgress,
    private loginService:LoginService,
    private configService:ConfigService,
    private zone:NgZone
  ) {
    
  }
  ws:WebSocket;
  tempData :KioskUser[] = [];
  data:KioskUser[]= [];   
  filterQuery = "";
  actionMode = "";
  private isAdmin = false;

  itemSearch(event) {
    if (event.keyCode != 13) return;

    console.log("filter query: ", this.filterQuery);
    
    this.doSearch();
  }
  doSearch() {
    let filter = this.filterQuery.toLowerCase();
    this.data = [];
    for (let item of this.tempData) {
      if (item.username.toLowerCase().indexOf(filter) > -1 || item.data.kioskId.toLowerCase().indexOf(filter) > -1 || item.data.kioskName.toLowerCase().indexOf(filter) > -1) {
        this.data.push(item);
      }
    }
  }
  initKioskMonitor():void{
   
    var token = this.loginService.getCurrentUserToken();
    if(token==null)return;
    this.ws = new WebSocket(this.configService.getWsRoot()+"kiosks/aliveness?sessionId="+token.sessionId);
    
    this.ws.onmessage = (ev:MessageEvent)=>{
      this.zone.run(() => {    
        console.log("MessageEvent", ev);    
        let result = JSON.parse(ev.data);
        console.log("alive result", result);
        if(result.length>0){
          for (let onlineKiosk of result){
          let kiosk = this.data.find(x=>x.data.kioskId == onlineKiosk.data.kioskId);          
          if(kiosk){
            kiosk.alive = 1;            
          }
        }
        }else if(result.kiosk && result.kiosk.data.kioskId){
          let kiosk = this.data.find(x=>x.data.kioskId == result.kiosk.data.kioskId);        
          console.log("alive kiosk", kiosk, result.alive);
          if(kiosk){
            kiosk.alive = result.alive;
            console.log(kiosk);
          }
        }
      });
    }

    this.ws.onopen =  () => {
      console.log("live kiosk update connection opened");
    };    
    
  }

  async ngOnInit(): Promise<void> {
    try{
      
      this.progressService.start();
      let items = await this.kioskService.read("&paging.all=true");      
      this.data= Object.assign([],items);
      this.tempData= Object.assign([],items);      
      this.isAdmin = this.userService.userIs(RoleEnum.Administrator);
      console.log("is admin:", this.isAdmin);

      this.initKioskMonitor();
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    } 
  }


  edit(item: KioskUser) {
    if(this.isLoading())return;
    console.log("edit", item);
    this.actionMode = this.commonService.getLocaleString("common.edit") ;

    let newData = new KioskUser();    
    newData.objectId = item.objectId;
    newData.username = item.username,
    newData.data = item.data;
    newData.roles = item.roles;
    newData.password = "";    

    this.showCreateEditDialog(newData, true);
  }
  private showCreateEditDialog(data: KioskUser, editMode: boolean) {
    //creates dialog form here
    let newForm = new CreateEditKioskComponent(this.kioskService, this.progressService, this.dialogService);
    newForm.setFormData(data, this.actionMode, editMode);
    this.dialogService.addDialog(CreateEditKioskComponent, newForm)
      .subscribe((result) => {
        //We get dialog result
        if (result) {          
          this.updateList(result);
        }
      });
  }

  createNew() {
    this.actionMode = this.commonService.getLocaleString("common.new") ;

    var u = ("000" + this.tempData.length);
    u = "kiosk" + u.substr(u.length - 3, 3);

    let newData = new KioskUser();
    newData.objectId = "";
    newData.username = u;
    newData.roles = [];
    let kioskRole = new Role();
    kioskRole.name = "Kiosk";
    newData.roles.push(kioskRole);
    newData.data = new KioskData();
    newData.data.kioskId = "";
    newData.data.kioskName = "";
    newData.password = "";

    this.showCreateEditDialog(newData, false);
  }
  
  async delete(item:KioskUser) {
    if(this.isLoading())return;

    console.log("delete", item);
    this.dialogService.addDialog(ConfirmComponent, {            
    })
      .subscribe(async (isConfirmed) => {
        //We get dialog result
        if (!isConfirmed) return;
        try{
          this.progressService.start();
          await this.kioskService.delete(item.objectId);                    
          //deletes data from array
          let index = this.data.indexOf(item, 0);                      
          this.data.splice(index, 1);          
          let tempIndex = this.tempData.indexOf(item, 0);            
          this.tempData.splice(tempIndex, 1);
          this.commonService.showAlert(item.name+this.commonService.getLocaleString("common.hasBeenDeleted")).subscribe(()=>{});
        }//no catch, global error handle handles it
        finally{      
          this.progressService.done();
        }    
      });
  }
  isLoading():boolean{
    return this.progressService.isStarted();
  }
  updateList(data:KioskUser) {   
    let tempIndex = this.tempData.map(function (e) { return e.objectId }).indexOf(data.objectId);
    if(tempIndex<0){
      this.tempData.push(data);
      this.data.push(data);
      this.commonService.showAlert(data.username +this.commonService.getLocaleString("common.hasBeenCreated")).subscribe(()=>{});
    }
    else{
      //update data at specified index
      this.tempData[tempIndex] = data;    
      let index = this.data.map(function (e) { return e.objectId }).indexOf(data.objectId);
      this.data[index] = data;
      this.commonService.showAlert(data.username +this.commonService.getLocaleString("common.hasBeenUpdated")).subscribe(()=>{});
    }
  }

}
