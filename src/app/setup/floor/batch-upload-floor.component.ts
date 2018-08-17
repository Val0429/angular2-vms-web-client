import { Component} from '@angular/core';
import { CreateEditDialog, Floor } from 'app/Interface/interface';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-batch-upload-floor',
  templateUrl: './batch-upload-floor.component.html'
})
export class BatchUploadFloorComponent extends DialogComponent<CreateEditDialog, boolean> implements CreateEditDialog {

  setData(title: string): void {
    this.title = title;
  }
  title: string;
  csvFile: FormControl;
  base64CsvFile: FormControl;
  constructor(dialogService: DialogService) {
    super(dialogService);
    this.csvFile = new FormControl('', [Validators.required]);
    this.base64CsvFile = new FormControl('', [Validators.required]);
    this.myform = new FormGroup({
      csvFile: this.csvFile,
      base64CsvFile: this.base64CsvFile
    });
  }


  myform : FormGroup;
  
  
  fileName: string = 'floor_data.xlsx';

  onFileChange(evt: any): void{    

     var file: File = evt.target.files[0];
    if (!file) return;
    //1024000

    let extension = /[^.]+$/.exec(file.name)[0];

    console.log("filename", file.name);
    console.log("Extension", extension);
    let invalidSize: boolean = (file.size > 1024000 * 5);
    if (invalidSize) {
      this.csvFile.setErrors({ "invalidSize": invalidSize });
    }
    let invalidExtension = (!extension || extension.toLowerCase() !== 'csv');
    if (invalidExtension) {
      this.csvFile.setErrors({ "invalidExt": invalidExtension });
    }

    if (!this.csvFile.valid) {
      console.log("file error", this.csvFile.errors);
      return;
    }

    let reader: FileReader = new FileReader();
    //Converting Binary Data to base 64    
    
    reader.onloadend = (e) => {      
      //console.log("finished reading csv file", reader.result);
      this.base64CsvFile.setValue( reader.result);
    }
    reader.readAsDataURL(file);
  }

  getData(): any {
    return this.base64CsvFile.value;
  }

  save() {
    this.result = true;
    this.close();
  }
}
