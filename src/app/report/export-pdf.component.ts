import { Component, OnInit } from '@angular/core';
import { InvestigationDisplay, CreateEditDialog } from '../infrastructure/interface';
import * as jspdf from "jspdf";  
import * as html2canvas from "html2canvas";
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

@Component({
  selector: 'app-export-pdf',
  templateUrl: './export-pdf.component.html'
})
export class ExportPdfComponent extends DialogComponent<CreateEditDialog, any> implements CreateEditDialog, OnInit {
  public title:string;
  data : InvestigationDisplay[] ;
  constructor(public dialogService: DialogService) {    
    super(dialogService);
   }
   public setFormData(data: InvestigationDisplay[] , title: string) {
    console.log("setFormData", data);
    this.data = data;    
    this.title = title;    
      
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
