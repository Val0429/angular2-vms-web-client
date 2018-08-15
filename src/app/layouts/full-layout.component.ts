import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
import { NgForm } from '@angular/forms';
import { UserService } from 'app/service/user.service';
import { LoginService } from 'app/service/login.service';
import { Router } from '@angular/router';
import { User } from 'app/Interface/interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  encapsulation: ViewEncapsulation.None  
})

export class FullLayoutComponent implements OnInit {
  model: {
    "title"?: string, "action": string, "username"?: string, "password"?: string, "newpassword"?: string, "repeatpassword"?: string, "buttom"?: string, "objectId":string
  } =
    {
      "objectId":"",
      "title": "Change Password",
      "action": "Modify",
      "username": "",
      "password": "",
      "newpassword": "",
      "repeatpassword": "",
      "buttom": "Save"
    };


  constructor(private userService: UserService, private loginService: LoginService, private router:Router) { }

  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  async ngOnInit() {
    var user = await this.userService.getCurrentUser();
    this.model.objectId = user.objectId;
    this.model.username = user.username;
    //this.model.password = user.password ;
  }

  onFormSubmit(form: NgForm) {
    if (form.invalid) {
       return;
    }
console.log('form submit');

    this.saveChangePassword();
 }


  public changePassword() {
    this.model.title = "Modify Person";
    this.model.action = "Modify";
    this.model.newpassword = "";
    this.model.repeatpassword = "";
    this.model.buttom = "Save";
  }

  async saveChangePassword() {    
    // Update password User
    console.log("update Password Current User");
    let data: User = new User();
    
    data.objectId= this.model.objectId;
    data.password= this.model.newpassword;    

    console.log(data);
    var result = await this.userService.updateUser(data)
      .catch(error => {
        console.log(error);
      });

    if (result) {
      //TODO: POP update result
      this.ngOnInit();
    }
    
  }

  public async logout() {
    var result = await this.loginService.logOut();
    if (result) {
      this.router.navigate(['/login']);
    }
  }
}

