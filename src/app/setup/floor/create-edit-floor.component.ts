import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { CreateEditDialog, Floor } from 'app/Interface/interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as Globals from 'app/globals';
@Component({
  selector: 'app-create-edit-floor',
  templateUrl: './create-edit-floor.component.html'
})
export class CreateEditFloorComponent extends DialogComponent<CreateEditDialog, boolean> implements CreateEditDialog {
  title: string;
  editMode: boolean;
  formData: Floor;
  myform: FormGroup;

  name: FormControl;
  unitNo: FormControl;
  floor: FormControl;
  phone: FormControl;

  constructor(dialogService: DialogService) {
    super(dialogService);
    this.formData = new Floor();
    this.createFormControls();
    this.createForm();

  }

  public setFormData(floorData: Floor, title:string, editMode: boolean) {
    this.myform.reset();

    this.formData = floorData;

    this.title = title;
    this.editMode = editMode;
    this.createFormControls();
    this.createForm();    

  }
  public getFormData(): Floor {    
    this.formData.name = this.name.value;
    this.formData.phone = this.phone.value.split(',');
    this.formData.unitNo = this.unitNo.value;
    this.formData.floor = this.floor.value;
    return this.formData;
  }


  createFormControls() {
    this.name = new FormControl(this.formData.name, [
      Validators.required,
      Validators.minLength(3)
    ]);

    this.phone = new FormControl(this.formData.phone ? this.formData.phone.toString(): '', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(Globals.multiPhoneRegex)
    ]);


    this.unitNo = new FormControl(this.formData.unitNo, [
      Validators.required,
      Validators.minLength(3)
    ]);
    this.floor = new FormControl(this.formData.floor, [
      Validators.required      
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
      unitNo: this.unitNo,
      phone: this.phone,
      floor: this.floor
    });
  }
}
