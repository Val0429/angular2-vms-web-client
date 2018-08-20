export class BaseClass {
  public objectId: string;
  public createdAt: string;
  public updatedAt: string;
}
export class BaseUser extends BaseClass {
  public username: string;
  public password: string;
  public roles: Roles[];
}

export class Floor extends BaseClass {
  
  public name: string;
  public unitNo: string;
  public phone: string[];
  public floor: number;
}
export class UserData {
  public email: string;
  public phone: string;
  public name: string;
}
export class User extends BaseUser {
  
  public data: UserData;
}
export class SessionToken {

  public sessionId: string;
  public serverTime: number;
  public user: User;

  public fromJSON(json: any): SessionToken {
    //let object = Object.create(sessionToken.prototype);
    //optional property

    this.user = json["user"];

    this.sessionId = json["sessionId"];
    this.serverTime = json["serverTime"];

    return this;
  }
}
export class KioskData {
  public kioskId: string;
  public kioskName: string;
}
export class KioskUser extends BaseUser {
  
  public data: KioskData;
}
export class Roles extends BaseClass{
  
  public name: string;
}
export class RoleOption extends Roles {
  public checked: boolean;
}
export class Person {
    public id: string;
    public fullname: string;
    public employeeno: string;
    public groups: string[];
    public face_id_numbers: string[];
    public image: string;
    public result: string;


    public fromJSON(json: any): Person {
        //let object = Object.create(Person.prototype);

        this.id = json["id"];
        this.fullname = json["fullname"];
        this.employeeno = json["employeeno"];
        this.groups = json["groups"];
        this.face_id_numbers = json["face_id_numbers"];
        this.image = json["image"];
        this.result = json["result"];
        return this;
    }

    public fromResult(json: any): Person {
        //let object = Object.create(Person.prototype);

        this.id = json["person_id"];
        this.fullname = json["person_info"]["fullname"];
        this.employeeno = json["person_info"]["employeeno"];
        // this.groups = json["groups"];        
        // this.face_id_numbers = json["face_id_numbers"];
        // this.image = json["image"];
        // this.result = json["result"];
        return this;
    }
}

export class Group {
    public id: string;
    public groupname: string;
    public push_action: Push_Action;

    public fromJSON(json: any): Group {
        //let object = Object.create(Group.prototype);

        this.id = json["id"];
        this.groupname = json["groupname"];
        this.push_action = json["push_action"];
        return this;
    }
}

export class Push_Action {
    public interval: number;
    public device_list: NotificationDevice[];

    public fromJSON(json: any): Push_Action {
        //let object = Object.create(Push_Action.prototype);

        this.interval = json["interval"];
        this.device_list = json["device_list"];

        return this;
    }
}

export class NotificationDevice {
    public push_device_id: string;
    public push_device_type: string;
    public push_device_name: string;
    public push_device_token: string;


    public fromJSON(json: any): NotificationDevice {
        //let object = Object.create(NotificationDevice.prototype);

        this.push_device_id = json["push_device_id"];
        this.push_device_type = json["push_device_type"];
        this.push_device_name = json["push_device_name"];
        this.push_device_token = json["push_device_token"];
        return this;
    }
}

export class Person_Info {
    public fullname: string;
    public employeeno: string;

    public fromJSON(json: any): Person_Info {
        this.fullname = json["fullname"];
        this.employeeno = json["employeeno"];
        return this;
    }
}

export class Verify_Result {
    public person_info: Person_Info;
    public person_id: string;
    public score: number;
    public target_score: number;
    public snapshot: string;
    public channel: string;
    public timestamp: number;
    public verify_face_id: string;

    public fromJSON(json: any): Verify_Result {
        this.person_info = new Person_Info().fromJSON(json["person_info"]);
        this.person_id = json["person_id"];
        this.score = json["score"];
        this.target_score = json["target_score"];
        this.snapshot = json["snapshot"];
        this.channel = json["channel"];
        this.timestamp = json["timestamp"];
        this.verify_face_id = json["verify_face_id"];

        return this;
    }
}

export class APNS_Push_Settings {
    public apns_topic: String;
    public apns_key: String;
    public apns_key_id: String;
    public apns_team_id: String

    public fromJSON(json: any): APNS_Push_Settings {
        this.apns_topic = json["apns_topic"];
        this.apns_key = json["apns_key"];
        this.apns_key_id = json["apns_key_id"];
        this.apns_team_id = json["apns_team_id"];

        return this;
    }
}

export class FCM_Push_Settings {
    public fcm_key: String;

    public fromJSON(json: any): FCM_Push_Settings {
        this.fcm_key = json["fcm_key"];
        return this;
    }
}

export class Mail_Server_Settings {
    public mail_server_host_address: String;
    public mail_server_host_port: String;
    public mail_server_host_secure: number;
    public mail_server_sender_name: String
    public mail_server_sender_username: String
    public mail_server_sender_password: String

    public fromJSON(json: any): Mail_Server_Settings {
        this.mail_server_host_address = json["mail_server_host_address"];
        this.mail_server_host_port = json["mail_server_host_port"];
        this.mail_server_host_secure = json["mail_server_host_secure"];
        this.mail_server_sender_name = json["mail_server_sender_name"];
        this.mail_server_sender_username = json["mail_server_sender_username"];
        this.mail_server_sender_password = json["mail_server_sender_password"];

        return this;
    }
}

export class General_Settings {
    public apn_notification_setting: boolean = false ;
    public apns_push_settings: APNS_Push_Settings = new APNS_Push_Settings();
    
    public fcm_notification_setting: boolean = false ;
    public fcm_push_settings: FCM_Push_Settings = new FCM_Push_Settings();
    
    public smtp_setting: boolean = false ;
    public mail_server_settings: Mail_Server_Settings = new Mail_Server_Settings();

    public fromJSON(json: any): General_Settings {
        this.apns_push_settings = new APNS_Push_Settings().fromJSON(json["apns_push_settings"]);
        this.fcm_push_settings = new FCM_Push_Settings().fromJSON(json["fcm_push_settings"]);
        this.mail_server_settings = new Mail_Server_Settings().fromJSON(json["mail_server_settings"]);

        return this;
    }
}

export class Network_Settings {
    public server_ip_address: String;
    public server_port: number;

    public fromJSON(json: any): Network_Settings {
        this.server_ip_address = json["server_ip_address"];
        this.server_port = json["server_port"];

        return this;
    }
}

export class Recognition_Settings {
    public video_source_sourceid?: string = "" ;
    public video_source_location?: string = "" ;
    public video_source_type?: string = "" ;
    public video_source_ip?: string = "" ;
    public video_source_port?: number = 80 ;
    public video_source_channel?: number = 0 ;
    public video_source_username?: string = "" ;
    public video_source_password?: string = "" ;
    public video_source_rtsp_path?: string = "/" ;
    public video_decode_key_frame_only?: number = 0 ;
    public min_face_size_width?: number = 0 ;
    public min_face_size_height?: number = 0 ;
    public face_capture_biggest_only?: number = 0 ;
    public face_capture_time_interval?: number = 1000 ;
    public face_capture_mirror_image?: number = 0 ;
    public face_verify_target_sorce?: number = 0.9 ;
    public face_verify_action_enable?: number = 1 ;
    public max_buffering_video_frames?: number = 1 ;
    public max_uploading_threads?: number = 1 ;

    public fromJSON(json: any): Recognition_Settings {
        this.video_source_sourceid = json["video_source_sourceid"];
        this.video_source_location = json["video_source_location"];
        this.video_source_type = json["video_source_type"];
        this.video_source_ip = json["video_source_ip"];
        this.video_source_port = json["video_source_port"];
        this.video_source_channel = json["video_source_channel"];
        this.video_source_username = json["video_source_username"];
        this.video_source_password = json["video_source_password"];
        this.video_source_rtsp_path = json["video_source_rtsp_path"];
        this.video_decode_key_frame_only = json["video_decode_key_frame_only"];
        this.min_face_size_width = json["min_face_size_width"];
        this.min_face_size_height = json["min_face_size_height"];
        this.face_capture_biggest_only = json["face_capture_biggest_only"];
        this.face_capture_time_interval = json["face_capture_time_interval"];
        this.face_capture_mirror_image = json["face_capture_mirror_image"];
        this.face_verify_target_sorce = json["face_verify_target_sorce"];
        this.face_verify_action_enable = json["face_verify_action_enable"];
        this.max_buffering_video_frames = json["max_buffering_video_frames"];
        this.max_uploading_threads = json["max_uploading_threads"];

        return this;
    }
}


export class Face_Settings {
    public fcs_settings ?: Recognition_Settings[] ;

    public fromJSON(json: any): Face_Settings {
        this.fcs_settings = [] ;

        for( var setting of json) {
            this.fcs_settings.push( new Recognition_Settings().fromJSON(setting) ) ;
        }

        return this;
    }
}

export interface CreateEditDialog {
  title: string;
}

export class Visitor_Profile {
    public mobile_no: String = "" ;
    public visitor_name: String = "" ;
    public email_address: String = "" ;
    public begin_datetime: String = "" ;
    public end_datetime: String = "" ;
    public purpose_of_visit: String = "" ;
    public photo: String = "" ;
    public vehicle_registration_number: String = "" ;

    public fromJSON(json: any): Visitor_Profile {
        this.mobile_no = json["mobile_no"];
        this.visitor_name = json["visitor_name"];
        this.email_address = json["email_address"];
        this.begin_datetime = json["begin_datetime"];
        this.end_datetime = json["end_datetime"];
        this.purpose_of_visit = json["purpose_of_visit"];
        this.photo = json["photo"];
        this.vehicle_registration_number = json["vehicle_registration_number"];

        return this;
    }
}
