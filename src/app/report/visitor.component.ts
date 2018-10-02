import { Component, OnInit } from '@angular/core';
import { DialogService, DialogComponent } from 'ng2-bootstrap-modal';
import { CreateEditDialog, RecurringVisitor } from '../Interface/interface';

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html'
})
export class VisitorComponent extends DialogComponent<CreateEditDialog, RecurringVisitor> implements CreateEditDialog, OnInit {
  public title:string;
  data : RecurringVisitor;
  constructor(public dialogService: DialogService) {
    super(dialogService);
   }
   public setFormData(data: RecurringVisitor, title: string) {
    console.log("setFormData");
    this.data = Object.assign({}, data);    
    this.title = title;    
  }
  ngOnInit() {
  }
}
