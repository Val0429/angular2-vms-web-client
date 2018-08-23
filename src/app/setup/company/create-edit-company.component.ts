import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { CreateEditDialog, Company, Floor } from '../../Interface/interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as Globals from 'app/globals';
@Component({
  selector: 'app-create-edit-company',
  templateUrl: './create-edit-company.component.html'
})
export class CreateEditCompanyComponent  extends DialogComponent<CreateEditDialog, boolean> implements CreateEditDialog{
  
  title: string;  
  editMode:boolean;
  formData: Company; 
  tempCheckBoxData:string[];

  myform: FormGroup;
  unitNumber: FormControl;  
  contactNumber: FormControl;
  contactPerson: FormControl;
  name: FormControl;
  //floor: FormControl;
  floorOptions : Floor[];

  public setFormData(formData: Company, floorOptions:Floor[], title: string, editMode: boolean) {
    this.formData = formData;
    this.title = title;
    this.editMode = editMode;
    this.floorOptions = floorOptions;
    //binding data
    this.createFormControls();
    this.createForm();
  }
  constructor(dialogService: DialogService) {
    super(dialogService);

    //initialization
    let initForm = new Company();
    this.setFormData(initForm, [], "Init Form", true);
  }
  
  public getFormData(): Company {
    let formResult = this.myform.value;  
    this.formData.name=formResult.name;
    this.formData.contactPerson=formResult.contactPerson;
    this.formData.unitNumber=formResult.unitNumber;
    this.formData.contactNumber=formResult.contactNumber.split(',');
    
    this.formData.floor= [];
    this.formData.floor.push("8UTZJ7APdv" as any);
    this.formData.floor.push("K4yesDCDRH" as any);

    return this.formData;
  }


  createFormControls() {
    this.name = new FormControl(this.formData.name, [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.contactPerson = new FormControl(this.formData.contactPerson, [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.unitNumber = new FormControl(this.formData.unitNumber, [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.unitNumber = new FormControl(this.formData.unitNumber, [
      Validators.required,
      Validators.minLength(3)
    ]);
    //this.floor = new FormControl(this.formData.floor.map(function(e){return e.objectId}));
    this.contactNumber = new FormControl(this.formData.contactNumber, [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(Globals.multiPhoneRegex)
    ]);

  }

  addRemoveCheckBox(checked: boolean, value:string) {
    console.log("clicked checkbox:", checked, value);
    //assign checked value to temp role 
    if (checked) {
      this.tempCheckBoxData.push(value);
    }      
    else {
      let findIndex = this.tempCheckBoxData.indexOf(value);
      if (findIndex>-1)
        this.tempCheckBoxData.splice(findIndex, 1);
    }

  }

  save() {
    // we set dialog result as true on click on confirm button, 
    // then we can get dialog result from caller code 
    this.result = true;
    this.close();
  }
  createForm() {
    this.myform = new FormGroup({      
      name: this.name,    
      unitNumber: this.unitNumber,
      contactPerson: this.contactPerson,
      contactNumber:this.contactNumber
    });
  }

}
