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

  onFileChange(evt: any): void{    

     var file: File = evt.target.files[0];
     if (file == null) return;
     if (file.size > 1024000 * 5) {
       //TODO: add error message
       return;
     }
    let reader: FileReader = new FileReader();
    //Converting Binary Data to base 64    
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {      
      console.log("finished reading csv file", reader.result);
     }     
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
