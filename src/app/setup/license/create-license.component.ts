import { Component, OnInit } from '@angular/core';
import { License, CreateEditDialog } from '../../Interface/interface';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { NgProgress } from 'ngx-progressbar';
import { LicenseService } from '../../service/license.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-license',
  templateUrl: './create-license.component.html'
})
export class CreateLicenseComponent extends DialogComponent<CreateEditDialog, boolean> implements CreateEditDialog, OnInit {
  macOptions :string [];
  keyOrData : FormControl;
  licFile : FormControl;
  serialNumber : FormControl;
  mac : FormControl;
  myform: FormGroup;
  title: string;
  onlineMode:boolean = true;


  async ngOnInit() {
    this.macOptions = await this.licenseService.readMac();
  }
  createForm(): void {
    this.myform = new FormGroup({
      keyOrData: this.keyOrData,      
      mac:this.mac,
      serialNumber: this.serialNumber,
      licFile: this.licFile
    });
  }
  createFormControls(): void {
    this.keyOrData = new FormControl('', [Validators.required,Validators.minLength(29)]);
    this.serialNumber = new FormControl('', [Validators.minLength(29),Validators.maxLength(29)]);
    this.licFile = new FormControl('');
    this.mac = new FormControl('',Validators.required);
  }
  
  constructor(private licenseService:LicenseService, private progressService:NgProgress, public dialogService:DialogService) {
    super(dialogService);

    this.createFormControls();
    this.createForm();

   }
   async save():Promise<void> {
    try{      
      this.progressService.start();    
      await this.licenseService.post(this.keyOrData.value, this.mac.value.toUpperCase());
      this.result = true;
      this.close();  
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }
   updateKeyOrData(){
    this.keyOrData.setValue(this.serialNumber.value);
  }
  onFileChange(evt: any): void{    

    var file: File = evt.target.files[0];
   if (!file) return;
   //1024000

   let extension = /[^.]+$/.exec(file.name)[0].toLowerCase() ;

   console.log("filename", file.name);
   console.log("Extension", extension);
   
   if (file.size > 1024000 * 5) {
    this.licFile.setErrors({ "invalidSize": true });
     this.keyOrData.setErrors({ "invalidSize": true });
     return;
   }
   
   if (!extension || extension !="lic") {
     this.licFile.setErrors({ "invalidExt": true });
     this.keyOrData.setErrors({ "invalidExt": true });
     console.log("keyOrData.errors",this.keyOrData.errors);
     return;
   }

   let reader: FileReader = new FileReader();   
   reader.onloadend = (e) => {      
     console.log("finished reading lic file", reader.result);
     this.keyOrData.setValue( reader.result);
   }
   reader.readAsBinaryString (file);
 }
}
