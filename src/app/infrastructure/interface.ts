export interface BaseInterface {
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

export class Floor extends BaseClass {

    public floor: number;
}

export class BaseUser extends BaseClass {
    public publicEmailAddress: string;
    public username: string;
    public password: string;
    public roles: Role[];
}

export class Company extends BaseClass {
    public contactNumber: string[];
    public floor: Floor[];
    public unitNumber: string;
    public contactPerson: string;
}

export class UserData {
    public floor: Floor[];
    public company: Company;

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
}

export class KioskData {
  public kioskId: string;
  public kioskName: string;
  public activated:boolean;
}

export class KioskUser extends BaseUser {

    public data: KioskData;
}

export class Role extends BaseClass {

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

export interface CrudInterface<T> {
    uriCrud: string;
    create(data: T): Promise<T>;
    update(data: T): Promise<T>;
    read(filter: string): Promise<T[]>;
    delete(objectId: string): Promise<T>;
}

export interface FloorServiceInterface<T> extends CrudInterface<T> {
    uriBatchFloor: string;
    batchUploadFloor(data: any): Promise<any>;
}

export interface UserServiceInterface<T> extends CrudInterface<T> {
    uriRoleCrud: string;
    userIs(role: RoleEnum): boolean;
    getUserRole(): Promise<string[]>;
}

export class Purpose extends BaseClass {
    
}
export class NotifyVisitor{
    public email:boolean;
    public phone:boolean;
}
export class Notify{
    public visitor:NotifyVisitor;
}
export class InvitationDate{
    public start:Date;
    public end:Date;
    public pin:string;
}
export class Invitation extends BaseClass {
    public cancelled:boolean;
    public notify:Notify;
    public dates:InvitationDate[];
    public purpose:Purpose;
    public visitor:Visitor;
}

export class KioskEvent extends BaseClass{
    public action: string;    
    public pin:string;
    public score:number;
    public image:string;
}
export class Investigation{
    public visitor:Visitor;
    public invitation:Invitation;
    public company:Company;
    public kiosk:KioskUser;
    public purpose : Purpose;
    public events:KioskEvent[];
}

export class EventInvestigation extends BaseClass{
    public action:string;    
    public visitor:Visitor;
    public purpose:Purpose;
    public invitation:Invitation;
    public kiosk:KioskUser;
    public pin:string;
    public score:number;
    public image:string;
}