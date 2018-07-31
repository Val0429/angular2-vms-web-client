import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from 'app/service/user.service';
import { GeneralService } from 'app/service/general.service';

import { General_Settings } from 'app/Interface/interface';

@Component({
  templateUrl: 'server.component.html'
})
export class ServerComponent {
   public model:General_Settings = new General_Settings();

  constructor(private _userService: UserService, private _generalService: GeneralService) {
    var me = this;
    setTimeout(async () => {
      let setting = await this._generalService.getServerSettings();

      // {
      //   "apns_push_settings": {
      //   "apns_topic": "com.isapsolution.frs",
      //   "apns_key": "-----BEGIN PRIVATE KEY----- MIGTAgEAMBMGByqGSM49AgEGCC


      me.model.apns_push_settings.apns_topic = setting["apns_push_settings"]["apns_topic"];
      me.model.apns_push_settings.apns_key = setting["apns_push_settings"]["apns_key"];
      me.model.apns_push_settings.apns_key_id = setting["apns_push_settings"]["apns_key_id"];
      me.model.apns_push_settings.apns_team_id = setting["apns_push_settings"]["apns_team_id"];
      if (me.model.apns_push_settings.apns_topic != '' ) me.model.apn_notification_setting = true ;

      me.model.fcm_push_settings.fcm_key = setting["fcm_push_settings"]["fcm_key"];
      if (me.model.fcm_push_settings.fcm_key != '' ) me.model.fcm_notification_setting = true ;

      me.model.mail_server_settings.mail_server_host_address = setting["mail_server_settings"]["mail_server_host_address"];
      me.model.mail_server_settings.mail_server_host_port = setting["mail_server_settings"]["mail_server_host_port"];
      me.model.mail_server_settings.mail_server_host_secure = setting["mail_server_settings"]["mail_server_host_secure"];
      me.model.mail_server_settings.mail_server_sender_name = setting["mail_server_settings"]["mail_server_sender_name"];
      me.model.mail_server_settings.mail_server_sender_username = setting["mail_server_settings"]["mail_server_sender_username"];
      me.model.mail_server_settings.mail_server_sender_password = setting["mail_server_settings"]["mail_server_sender_password"];
      if (me.model.mail_server_settings.mail_server_host_address != '' ) me.model.smtp_setting = true ;

    }, 1000);
  }

  async onFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log('form submit');

    var result = await this._generalService.modifyServerSettings(JSON.stringify(this.model));
  }

}