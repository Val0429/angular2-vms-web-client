import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { CreateEditDialog, Floor } from 'app/infrastructure/interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as Globals from 'app/globals';
import { NgProgress } from 'ngx-progressbar';
import { FloorService } from '../../service/floor.service';
@Component({
  selector: 'app-create-edit-floor',
  templateUrl: './create-edit-floor.component.html'
})
export class CreateEditFloorComponent extends DialogComponent<CreateEditDialog, Floor> implements CreateEditDialog {
  title: string;
  editMode: boolean;
  formData: Floor;
  myform: FormGroup;

  name: FormControl;
  floor: FormControl;

  constructor(
    private floorService:FloorService,
    private progressService:NgProgress,    
    dialogService: DialogService
  ) {
    super(dialogService);
    //initialization
    let initForm = new Floor();
    this.setFormData(initForm, "Init Form", true);
  }

  public setFormData(floorData: Floor, title:string, editMode: boolean) {
    
    this.formData = Object.assign({}, floorData);
    this.title = title;
    this.editMode = editMode;
    this.createFormControls();
    this.createForm();    

  }

  createFormControls() {
    this.name = new FormControl(this.formData.name, [
      Validators.required,
      Validators.minLength(3)
    ]);

    this.floor = new FormControl(this.formData.floor, [
      Validators.required,
      Validators.pattern(Globals.numberRegex)
    ]);

  }
  async update(data:Floor) {             
    
    console.log("update", data);           
    return await this.floorService.update(data);
  }
  async create(data:Floor):Promise<Floor>  {    
    console.log("create", data);
    return await this.floorService.create(data);
  }
  async save():Promise<void> {
    try{      
      this.progressService.start();    
      //build data that will be sent to backend
      let formResult: Floor = new Floor(); 
      formResult.objectId = this.formData.objectId;     
      formResult.name = this.myform.value.name;
      formResult.floor = this.myform.value.floor;
      
      //close form with success
      this.result = formResult.objectId === "" ? await this.create(formResult): await this.update(formResult);
      this.close();  
    }//no catch, global error handle handles it
    finally{      
      this.progressService.done();
    }
  }

  createForm() {
    this.myform = new FormGroup({
      name: this.name,
      floor: this.floor
    });
  }
}
