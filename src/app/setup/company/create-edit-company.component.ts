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
  myform: FormGroup;
  unitNumber: FormControl;  
  contactNumber: FormControl;
  contactPerson: FormControl;
  name: FormControl;
  floor: FormControl;
  floorOptions : Floor[]=[];  
  showFloor:boolean=false;

  public setFormData(formData: Company, floorOptions:Floor[], title: string, editMode: boolean) {
    this.formData = new Company();
    
    //copy this object to prevent back reference
    this.formData = Object.assign({}, formData);   
    this.formData.floor = Object.assign([], formData.floor);   
    //copy array of floor options
    for(let item of floorOptions){
      let findIndex = formData.floor.map(function(e){return e.objectId}).indexOf(item.objectId);
      //push if it's not already selected
      if(findIndex < 0) this.floorOptions.push(item);
    }

    this.title = title;
    this.editMode = editMode;
    
    //binding data
    this.createFormControls();
    this.createForm();
  }
  constructor(dialogService: DialogService) {
    super(dialogService);

    //initialization
    let initForm = new Company();
    initForm.contactNumber=[];
    this.setFormData(initForm, [], "Init Form", true);
  }
  
  public getFormData(): Company {
    let formResult = this.myform.value;  
    this.formData.name=formResult.name;
    this.formData.contactPerson=formResult.contactPerson;
    this.formData.unitNumber=formResult.unitNumber;
    this.formData.contactNumber=formResult.contactNumber.split(',');    
    //set this value back the way backend wants it
    this.formData.floor= formResult.floor;
    return this.formData;
  }

toggleFloor(){
  this.showFloor=!this.showFloor;
}
removeFloor(item:Floor){
  //assume there's always this option index
  let findIndex = this.formData.floor.map(function(e){return e.objectId}).indexOf(item.objectId);
  
  let findOptionIndex = this.floorOptions.map(function(e){return e.objectId}).indexOf(item.objectId);

  if(findOptionIndex < 0){
    this.floorOptions.push(item);
    this.formData.floor.splice(findIndex, 1);
  }
  else{
    this.floorOptions.splice(findOptionIndex, 1);
    this.formData.floor.push(item);
  }
  
    //formats it the way backend wants it
  this.floor.setValue(this.formData.floor.map(function(e){return e.objectId}));
}
addFloor(item:Floor){
  let findIndex = this.formData.floor.map(function(e){return e.objectId}).indexOf(item.objectId);
  //assume there's always this option index
  let findOptionIndex = this.floorOptions.map(function(e){return e.objectId}).indexOf(item.objectId);

  if(findIndex < 0){
    this.formData.floor.push(item);
    this.floorOptions.splice(findOptionIndex, 1);
  }
  else{
    this.formData.floor.splice(findIndex, 1);
    this.floorOptions.push(item);
  }
  
    //formats it the way backend wants it
  this.floor.setValue(this.formData.floor.map(function(e){return e.objectId}));
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
    this.floor = new FormControl(this.formData.floor);
    this.contactNumber = new FormControl(this.formData.contactNumber.toString(), [
      Validators.required,      
      Validators.pattern(Globals.multiPhoneRegex)
    ]);
    
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
      contactNumber:this.contactNumber,
      floor:this.floor
    });
  }

}
