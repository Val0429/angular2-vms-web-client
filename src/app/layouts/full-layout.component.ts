import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'app/service/user.service';
import { LoginService } from 'app/service/login.service';
import { Router } from '@angular/router';
import { User, RoleEnum } from 'app/infrastructure/interface';
import { ChangePasswordFormComponent } from './change-password-form.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { CommonService } from '../service/common.service';
import { SetupService } from 'app/service/setup.service';
import { AboutUsComponent } from './about-us.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  encapsulation: ViewEncapsulation.None  
})

export class FullLayoutComponent   implements OnInit {

  constructor(private userService: UserService, 
    private loginService: LoginService, 
    private setupService:SetupService,
    private router: Router, 
    private dialogService:DialogService,
    private commonService:CommonService
    ) {
      this.commonService.loadLanguage();
  }

  username: string;
  public status: { isopen: boolean } = { isopen: false };

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }
  userIsTenantAdmin: boolean;
  userIsTenantUser: boolean;
  userIsSysAdmin: boolean;
  userIsAdmin: boolean ;
  userIsKiosk: boolean;
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
    this.userIsTenantAdmin=this.userService.userIs(RoleEnum.TenantAdministrator);
    this.userIsKiosk=this.userService.userIs(RoleEnum.Kiosk);
    this.userIsAdmin=this.userService.userIs(RoleEnum.Administrator);
    this.userIsTenantUser=this.userService.userIs(RoleEnum.TenantUser);
    this.userIsSysAdmin=this.userService.userIs(RoleEnum.SystemAdministrator);

    console.log("user is admin:", this.userIsAdmin);
    console.log("user is tenant admin:", this.userIsTenantAdmin);
    console.log("user is tenant user:", this.userIsTenantUser);
    console.log("user is kiosk:", this.userIsKiosk);
    console.log("user is sysadmin:", this.userIsSysAdmin);
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
          let data={objectId: user.objectId, newPassword:formData.passwordGroup.newPassword, oldPassword:formData.oldPassword}          
          this.saveChangePassword(data);
        }
      });
  }
 async about(){
   let version = await this.setupService.getVersion();
   let about = new AboutUsComponent(this.dialogService);
   about.setFormData(version);
   console.log(version);
   this.dialogService.addDialog(AboutUsComponent, about).subscribe(()=>{});
 }
  async saveChangePassword(data:any) {    
    try{
      // Update password User
      console.log("update Password Current User", data);
      var result = await this.userService.changePassword(data);
      if(result){
        this.commonService.showAlert(this.commonService.getLocaleString("common.password")+
        this.commonService.getLocaleString("common.hasBeenUpdated")+", "+
        this.commonService.getLocaleString("pageLogin.pleaseRelogin"),
        this.commonService.getLocaleString("common.alert")).subscribe(async()=>{
          await this.logout();
      });        
      }
    }catch(err){
      console.error(err);
      this.commonService.showAlert(this.commonService.getLocaleString("pageLayout.header.changePassword")+this.commonService.getLocaleString("common.failed")).subscribe();
    }
    finally{

    }
  }

  public async logout() {
    try{
      await this.loginService.logOut();      
    }catch(err){
      console.error(err);
    }finally{
      this.router.navigate(['/login']);
    }
  }
}

