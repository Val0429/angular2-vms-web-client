export interface BaseInterface{
  objectId: string;
  createdAt: string;
  updatedAt: string;
}

export class BaseClass implements BaseInterface {
    public objectId: string;
    public createdAt: string;
    public updatedAt: string;
    public name: string;
}

export class Floor extends BaseClass{
    
    public floor: number;
}

export class BaseUser extends BaseClass {
    public publicEmailAddress: string;
    public username: string;
    public password: string;
    public roles: Role[];
}

export class Company extends BaseClass{
    public contactNumber:string[];
    public floor:Floor[];
    public unitNumber:string;
    public contactPerson:string;
}

export class UserData {
    public floor:Floor[];
    public company:Company;
  
}
export class Visitor extends BaseClass{
    public phone:string;
    public email:string;
    public company: Company;
    public status: number;    
    public image: string;    
}
export class RecurringVisitor{
    public visitor:Visitor;
    public totalVisit: number;
    public lastVisitDate: Date;
}
export class ReportStatistic{
    public date: string;
    public totalException:number;
    public totalVisitor:number;
}
export class User extends BaseUser{
  public phone :string;
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
  public activated:boolean;
}

export class KioskUser extends BaseUser {
  
  public data: KioskData;
}

export class Role extends BaseClass{
  
}

export class License {
    public licenseKey: string;
    public description: string;
    public mac: string;
    public brand: string;
    public productNO: string;
    public count: number;

    public trial: boolean;
    public registerDate: string;
    public expireDate: string;
    public expired: boolean;
}

export class TotalLicense {
    public licenses: License[];    
    public summary: any;
}
export enum RoleEnum{
  SystemAdministrator = 0,
  Administrator = 1,  
  TenantAdministrator = 20,
  TenantUser = 21,
  Kiosk = 80
}

export interface CreateEditDialog {
  title: string;
}

export interface CrudInterface <T>{
    uriCrud:string;
    create(data:T):Promise<T>;
    update(data:T):Promise<T>;
    read(filter:string):Promise<T[]>;
    delete(objectId:string):Promise<T>;
}

export interface FloorServiceInterface<T> extends CrudInterface<T>{
    uriBatchFloor:string;
    batchUploadFloor(data: any): Promise<any>;
}

export interface UserServiceInterface<T> extends CrudInterface<T>{
    uriRoleCrud: string;
    userIs(role: RoleEnum): boolean ;
    getUserRole(): Promise<string[]>;
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
