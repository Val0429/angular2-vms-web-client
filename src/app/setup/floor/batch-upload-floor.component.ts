import { Component} from '@angular/core';
import { CreateEditDialog, Floor } from 'app/Interface/interface';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';


@Component({
  selector: 'app-batch-upload-floor',
  templateUrl: './batch-upload-floor.component.html'
})
export class BatchUploadFloorComponent extends DialogComponent<CreateEditDialog, boolean> implements CreateEditDialog {

  setData(title: string): void {
    this.title = title;
  }
  title: string;
  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  data: Floor [] = [];
  
  fileName: string = 'floor_data.xlsx';

  onFileChange(evt: any) {
    
  }
  getData(): any {
    console.log("Get Data", this.data);
    return this.data;
  }

  save() {
    this.result = true;
    this.close();
  }
}
