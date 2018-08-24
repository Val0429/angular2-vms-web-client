import { CoreService } from 'app/service/core.service';
import { LoginService } from 'app/service/login.service';
import { CrudInterface } from 'app/Interface/interface';


export class CrudService<T> implements CrudInterface<T>{
  public uriCrud: string;
  constructor(
    public coreService: CoreService,
    public loginService:LoginService
  ) { 
    this.uriCrud="";
    this.coreService = coreService;
    this.loginService = loginService;
  }

  public async create(data: T): Promise<T> {
    let token = this.loginService.getCurrentUserToken();

    let result = await this.coreService.postConfig({ path: this.uriCrud + "?sessionId=" + token.sessionId, data }).toPromise();

    console.log("create result: ", result);

    return result;
  }
  public async update(data: T): Promise<T> {
    
    let token = this.loginService.getCurrentUserToken();

    let result = await this.coreService.putConfig({ path: this.uriCrud + "?sessionId=" + token.sessionId, data }).toPromise();

    console.log("update result: ", result);

    return result;
  }
  public async read(filter: string): Promise<T[]> {
    var token = this.loginService.getCurrentUserToken();
    var items : T[]= [];
    var result = await this.coreService.getConfig({ path: this.uriCrud, query: "?sessionId=" + token.sessionId + filter }).toPromise();
      console.log("read result: ",result);
      if (result && result["results"]) {        
        result["results"].forEach(function (item) {
          if (item["objectId"])
            items.push(item);
        });
      }
      return items;
  }
  public async delete(objectId:string): Promise<T> {
    var token = this.loginService.getCurrentUserToken();
      var result = await this.coreService.deleteConfig({ path: this.uriCrud, query: ("?sessionId=" + token.sessionId + "&objectId=" + objectId) }).toPromise();
      console.log("delete result: ", result);
      return result;
  }
  
  

    
  

}
