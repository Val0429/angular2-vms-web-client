import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from 'app/service/user.service';
import { SetupService } from 'app/service/setup.service';

import { Network_Settings } from 'app/Interface/interface';

@Component({
  templateUrl: 'network.component.html'
})
export class NetworkComponent {
  public model: Network_Settings = new Network_Settings();

  constructor(private _userService: UserService, private _generalService: SetupService) {
    var me = this;
    setTimeout(async () => {
      // let setting = await this._generalService.getNetworkSettings();

      // me.model.apns_push_settings.apns_topic = setting["apns_push_settings"]["apns_topic"];
      // me.model.apns_push_settings.apns_key = setting["apns_push_settings"]["apns_key"];
      // me.model.apns_push_settings.apns_key_id = setting["apns_push_settings"]["apns_key_id"];
      // me.model.apns_push_settings.apns_team_id = setting["apns_push_settings"]["apns_team_id"];
      // me.model.fcm_push_settings.fcm_key = setting["fcm_push_settings"]["fcm_key"];
      // me.model.mail_server_settings.mail_server_host_address = setting["mail_server_settings"]["mail_server_host_address"];
      // me.model.mail_server_settings.mail_server_host_port = setting["mail_server_settings"]["mail_server_host_port"];
      // me.model.mail_server_settings.mail_server_host_secure = setting["mail_server_settings"]["mail_server_host_secure"];
      // me.model.mail_server_settings.mail_server_sender_name = setting["mail_server_settings"]["mail_server_sender_name"];
      // me.model.mail_server_settings.mail_server_sender_username = setting["mail_server_settings"]["mail_server_sender_username"];
      // me.model.mail_server_settings.mail_server_sender_password = setting["mail_server_settings"]["mail_server_sender_password"];
    }, 1000);
  }

  async onFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log('form submit');

    //var result = await this._generalService.modifyServerSettings(JSON.stringify(this.model));
  }

}
