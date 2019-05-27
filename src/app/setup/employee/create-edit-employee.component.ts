import { Component, OnInit } from '@angular/core';
import { CreateEditDialog, Employee } from 'app/infrastructure/interface';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { EmployeeService } from 'app/service/employee.service';
import { NgProgress } from 'ngx-progressbar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as Globals from 'app/globals';
import * as exif from 'jpeg-autorotate';

@Component({
  selector: 'app-create-edit-employee',
  templateUrl: './create-edit-employee.component.html',
  styleUrls: ['./create-edit-employee.component.scss']
})
export class CreateEditEmployeeComponent  extends DialogComponent<CreateEditDialog, Employee> implements CreateEditDialog{
  
  title: string;
  myform: FormGroup;

  cardno: FormControl;
  employeeno: FormControl;
  name: FormControl;
  image: FormControl;
  editMode: boolean;
  formData: Employee;
  constructor(private employeeService: EmployeeService,     
    private progressService:NgProgress,
    dialogService: DialogService,     ) {
      super(dialogService);
      //initialization
    let initForm = new Employee();
    this.setFormData(initForm, "Init Form", true);
     }
     async save():Promise<void> {
      try{      
        this.progressService.start();    
        //build data that will be sent to backend
        let formResult: Employee = new Employee(); 
        formResult.objectId = this.formData.objectId;     
        formResult.cardno = this.myform.value.cardno;
        formResult.employeeno = this.myform.value.employeeno;
        formResult.name = this.myform.value.name;
        formResult.image = this.myform.value.image;
        
        //close form with success
        this.result = formResult.objectId ? await this.update(formResult):await this.create(formResult);
        this.close();  
      }//no catch, global error handle handles it
      finally{      
        this.progressService.done();
      }
    }
    async update(data:Employee) {             
    
      console.log("update", data);           
      return await this.employeeService.update(data);
    }
    async create(data:Employee):Promise<Employee>  {    
      console.log("create", data);
      return await this.employeeService.create(data);
    }
  ngOnInit() {
  }
  setFormData(itemData: Employee, title: string, editMode: boolean) {
    this.formData = Object.assign({}, itemData);
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

    this.cardno = new FormControl(this.formData.cardno, [
      Validators.required,
      Validators.pattern(Globals.numberRegex)
    ]);

    this.image = new FormControl(this.formData.image, [
      Validators.required
    ]);    

    this.employeeno = new FormControl(this.formData.employeeno, [
      Validators.required,
      Validators.pattern(Globals.numberRegex)
    ]);
  }
  createForm() {
    this.myform = new FormGroup({
      cardno: this.cardno,
      employeeno: this.employeeno,
      name: this.name,
      image: this.image
    });
  }
  invalid:boolean;
  imageListener($event): void {
    this.invalid=false;

    var file: File = $event.target.files[0];
    if (!file) return;
    //1024000

    let extension = /[^.]+$/.exec(file.name)[0];

    console.log("filename", file.name);
    console.log("Extension", extension);
    let invalidSize: boolean = (file.size > 1024 * 200);
    if (invalidSize) {
      alert("Invalid Size");
      this.invalid=true;
    }
    let invalidExtension = (!extension || extension.toLowerCase() !== 'jpg');
    if (invalidExtension) {
      alert("Invalid Extension");
      this.invalid=true;
      return;
    }

    this.image.setValue("");

    // if (file.size > 1024000) {
    //   alert(file.size);
    //   return;
    // }

    var reader = new FileReader();
    reader.onload = async (e) => {
      var buf = new Buffer(reader.result.byteLength);
      var view = new Uint8Array(reader.result);
      for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
      }
      console.log("RotateImage") ;

      this.RotateImage(buf);

      if (this.image.value == "") {
        this.readImageBase64(file);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  RotateImage(file) {
    

    let options = { quality: 85 }

    exif.rotate(file, options,
      function (error, buffer, orientation, dimensions) {
        if (error) {
          console.log('An error occurred when rotating the file: ' + error.message)
          return
        }

        this.image.setValue(buffer.toString('base64'));

        console.log('Orientation was: ' + orientation)
        console.log('Height after rotation: ' + dimensions.height)
        console.log('Width after rotation: ' + dimensions.width)
      }
    );
  }

  readImageBase64(file) {
    
    var myReader: FileReader = new FileReader();

      myReader.onloadend = async (e) => {
        //var image = new Image();
        var result = myReader.result as any;

        console.log("readAsDataURL") ;

        if(!this.invalid)
          this.image.setValue(result);
        console.log(this.image);
        
      }
      myReader.readAsDataURL(file);
  }


}
