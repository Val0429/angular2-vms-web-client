import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ConfigService {
  private appConfig:any;

  constructor(private http: Http) { }

  loadAppConfig() {
    //force client to reload config every hour
    let date = new Date();
    return this.http.get('/assets/config.json?id='+date.getFullYear()+date.getMonth()+date.getDate()+date.getHours())
    .toPromise()
    .then(data => {
        this.appConfig = data.json();
    }).catch(error=>{
        //in case of missing config
        this.appConfig=null;
    });
  }

  getCgiRoot():string{
    // returns value from config
    if(this.appConfig && this.appConfig.cgiRoot) {
        return this.appConfig.cgiRoot;
    }
    //host distribution inside vsm server, we only need to return base url
    else{ 
        let getUrl = window.location;
        return getUrl .protocol + "//" + getUrl.host + "/";
    }    
  }
  getWsRoot():string{
    // returns value from config
    if(this.appConfig && this.appConfig.wsRoot) {
        return this.appConfig.wsRoot;
    }
    //host distribution inside vsm server, we only need to return base url
    else{ 
        let getUrl = window.location;
        return "ws://" + getUrl.host + "/" ;
    }
  }
}

export class ConfigServiceStub {

    getCgiRoot():string{
        return "";
    }
    getWsRoot():string{
      return "";
      }
  }