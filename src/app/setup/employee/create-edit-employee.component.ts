import { Component, OnInit } from '@angular/core';
import { CreateEditDialog, Employee } from 'app/infrastructure/interface';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { EmployeeService } from 'app/service/employee.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-create-edit-employee',
  templateUrl: './create-edit-employee.component.html',
  styleUrls: ['./create-edit-employee.component.scss']
})
export class CreateEditEmployeeComponent  extends DialogComponent<CreateEditDialog, Employee> implements CreateEditDialog{
  title: string;
  setFormData(initForm: Employee, title: string, editMode: boolean) {
    
  }

  constructor(private employeeService: EmployeeService,     
    private progressService:NgProgress,
    dialogService: DialogService,     ) {
      super(dialogService);
      //initialization
    let initForm = new Employee();
    this.setFormData(initForm, "Init Form", true);
     }

  ngOnInit() {
  }

}
