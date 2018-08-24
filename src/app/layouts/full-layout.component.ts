import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'app/service/user.service';
import { LoginService } from 'app/service/login.service';
import { Router } from '@angular/router';
import { User, RoleEnum } from 'app/Interface/interface';
import { ChangePasswordFormComponent } from './change-password-form.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { TranslateService } from 'ng2-translate';
import { BaseClassComponent, BaseComponent } from '../shared/base-class-component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  encapsulation: ViewEncapsulation.None  
})

export class FullLayoutComponent extends BaseClassComponent implements OnInit,BaseComponent {
  

  constructor(private userService: UserService, private loginService: LoginService, private router: Router, 
    dialogService: DialogService, 
    translateService:TranslateService) {
    super(dialogService,translateService);
  }

  username: string;
  public status: { isopen: boolean } = { isopen: false };

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }
  userIsTenant(): boolean{
    return this.userService.userIs(RoleEnum.Tenant);
  }
  userIsSysAdmin(): boolean {
    return this.userService.userIs(RoleEnum.SystemAdministrator);
  }
  userIsAdmin(): boolean {
    return this.userService.userIs(RoleEnum.Administrator);
  }
  userIsKiosk(): boolean {
    return this.userService.userIs(RoleEnum.Kiosk);
  }
  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  ngOnInit() {
    var user = this.userService.getCurrentUser();
    if (user) {
      this.username = user.username;
    } else {
      this.username = "InitUser";
    }
    console.log("user is admin:", this.userIsAdmin());
    console.log("user is tenant:", this.userIsTenant());
    console.log("user is kiosk:", this.userIsKiosk());
    console.log("user is sysadmin:", this.userIsSysAdmin());
  }


  public changePassword() {
    //creates dialog form here
    let newForm = new ChangePasswordFormComponent(this.dialogService);
    //sets form data
    newForm.setFormData(this.username);
    this.dialogService.addDialog(ChangePasswordFormComponent, newForm)
      .subscribe((saved) => {
        //We get dialog result
        if (saved) {
          let formData = newForm.getFormData();
          var user = this.userService.getCurrentUser();
          var data = new User();              
          data.objectId = user.objectId;
          data.password = formData.passwordGroup.newPassword;
          this.saveChangePassword(data);
        }
      });
  }

  async saveChangePassword(data:User) {    
    // Update password User
    console.log("update Password Current User", data);
    var result = this.userService.update(data);
    if(result){
      this.showAlert(this.getLocaleString("common.password")+
      " "+this.getLocaleString("common.hasBeenUpdated")+", "+
      this.getLocaleString("pageLogin.pleaseRelogin"),
    this.getLocaleString("common.alert"));
      await this.logout();
    }
  }

  public async logout() {
    var result = await this.loginService.logOut();
    if (result) {
      this.router.navigate(['/login']);
    }
  }
}

