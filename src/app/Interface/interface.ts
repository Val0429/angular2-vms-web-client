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

export class User extends BaseUser {
    public phone: string;
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

export class Role extends BaseClass {

}

export enum RoleEnum {
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

export class purposes {
    public objectId: String = "";
    public name: String = "";

    public fromJSON(json: any): purposes {
        this.objectId = json.objectId;
        this.name = json.name;

        return this;
    }
}
export class visitorProfile {
    public objectId: String = "";
    public name: String = "";
    public phone: String = "";
    public email: String = "";
    public dates: Array<{ start: Date, end: Date, pin: String }> = [];
    public purpose: purposes = null;
    public photo: String = "";
    public status: String = "Pending";
    public cancelled: boolean = false;

    private beginDate: Date = new Date();
    private endDate: Date = new Date();

    public fromJSON(json: any): visitorProfile {
        this.objectId = json.objectId ;
        this.name = json.visitor.name;
        this.phone = json.visitor.phone;
        this.email = json.visitor.email;
        this.purpose = new purposes().fromJSON(json.purpose);
        //this.photo = json["photo"];
        this.status = json.visitor.status;
        this.cancelled = json.cancelled;

        this.beginDate = null;
        this.endDate = null;

        for (var d of json.dates) {
            var dt = { start: new Date(d.start), end: new Date(d.end), pin: d.pin };

            if (this.beginDate == null)
                this.beginDate = dt.start;
            else
                if (this.beginDate.getTime() > dt.start.getTime())
                    this.beginDate = dt.start;

            if (this.endDate == null )                    
                this.endDate = dt.end;
            else
                if (this.endDate.getTime() < dt.end.getTime())
                    this.endDate = dt.end;

            this.dates.push(dt);
        }

        return this;
    }
}
