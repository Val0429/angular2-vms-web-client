import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ConfigService {
  private appConfig;

  constructor(private http: Http) { }

  loadAppConfig() {
    return this.http.get('/assets/config.json')
      .toPromise()
      .then(data => {
        this.appConfig = data.json();
      });
  }

  getCgiRoot():string{
      return this.appConfig.cgiRoot;
  }
  getWsRoot():string{
    return this.appConfig.wsRoot;
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