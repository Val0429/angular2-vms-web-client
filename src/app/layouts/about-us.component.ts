import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html'
})
export class AboutUsComponent extends DialogComponent<any, boolean>   {
  year:number=new Date().getFullYear();
  data:any;
  public setFormData(version:any) {    
    
    this.data=version;
  }
  constructor(dialogService: DialogService) {
    super(dialogService);
    
  }

  

}
