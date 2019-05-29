import { Component, OnInit } from '@angular/core';
import { InvestigationDisplay, CreateEditDialog, SessionToken } from '../infrastructure/interface';
import * as jspdf from "jspdf";  
import * as html2canvas from "html2canvas";
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { LoginService } from 'app/service/login.service';
import { ConfigService } from 'app/service/config.service';

@Component({
  selector: 'app-export-pdf',
  templateUrl: './export-pdf.component.html',
  styles:[`
    .visitor-image{
        max-width:240px;
        width:auto;
        height: 300px;
    }
  `]
})
export class ExportPdfComponent extends DialogComponent<CreateEditDialog, any> implements CreateEditDialog, OnInit {
  public title:string;
  data : InvestigationDisplay[] ;
  
    cgiRoot: string;
  
  constructor(
        public dialogService: DialogService, 
        private loginService:LoginService, 
        private configService:ConfigService) {    
    super(dialogService);
    this.cgiRoot = this.configService.getCgiRoot();
   }
   public setFormData(data: InvestigationDisplay[] , title: string) {
    console.log("setFormData", data);
    this.data = data;    
    this.title = title;    
      for(let item of this.data ){
          for(let event of item.events){
            if(event.score && event.score<1){
                event.score=Math.ceil(event.score * 100);
            }
            if(event.image){
                let visitorImage ="";
                event.image = event.image.replace("localhost", this.configService.getLocation().hostname);
                if(item.visitor.image){
                  visitorImage = item.visitor.image.replace ("localhost", this.configService.getLocation().hostname);                    
                }else if(item.visitor.idcard && item.visitor.idcard.images && item.visitor.idcard.images.length>1)
                {
                  visitorImage = item.visitor.idcard.images[0].replace ("localhost", this.configService.getLocation().hostname);
                }
                event.imgUrl=this.cgiRoot+"thumbnail?url="+visitorImage+"&size=300&sessionId="+this.loginService.getCurrentUserToken().sessionId;
              }
          }
      }
  }
  ngOnInit() {    
    
  }
  export(){
    if(this.data.length<=0)return;
    var data = document.getElementById('pdfContent');  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var imgHeight = canvas.height * imgWidth / canvas.width;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('vms-investigation.pdf'); // Generated PDF   
    });
  }
}
