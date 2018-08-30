import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class CoreService {
  constructor(private http: Http) {}

  getConfig(args: { path?: string, query?: string }): Observable<any> {
    let finalUrl = args.path;

    if (args.query) {
      finalUrl += args.query;
    }

    const options = new RequestOptions();
    return this.http.get(finalUrl, options)
      .map((response: Response) => {
        if (!response.headers.get("content-type") || response.headers.get("content-type") !== "application/json; charset=utf-8") return response;
        return response.json();
      })
       .catch((error:any) => 
         Observable.throw(error)
    );
  }

  deleteConfig(args: { path: string, query?: string }): Observable<any> {
    let finalUrl = args.path;

    if (args.query) {
      finalUrl += args.query;
    }

    const options = new RequestOptions();
    
    return this.http.delete(finalUrl, options)
      .map((response: Response) => {
        if (!response.headers.get("content-type") || response.headers.get("content-type") !== "application/json; charset=utf-8") return response;
        return response.json();
      })
      .catch((error: any) =>
        Observable.throw(error)
      );
  }
  postConfig(args: { path: string, data: any }): Observable<any> {
    const finalUrl = args.path;
    var headers = new Headers();
    headers.append("content-type", "application/json");
    const options = new RequestOptions();
    options.headers = headers;
    return this.http.post(finalUrl, args.data, options)
      .map((response: Response) => {
        if (!response.headers.get("content-type") || response.headers.get("content-type") !== "application/json; charset=utf-8") return response;
        return response.json();
      })
      .catch((error: any) =>
        Observable.throw(error)
      );
  }
  putConfig(args: { path: string, data: any }): Observable<any> {
    const finalUrl = args.path;
    var headers = new Headers();
    headers.append("content-type", "application/json");
    const options = new RequestOptions();
    options.headers = headers;
    return this.http.put(finalUrl, args.data, options)
      .map((response: Response) => {        
        if (!response.headers.get("content-type") || response.headers.get("content-type") !== "application/json; charset=utf-8") return response;
        return response.json();
      })
      .catch((error: any) =>
        Observable.throw(error)
      );
  }
  getImage(args: { path: string }) {
    let finalUrl = args.path;

    const options = new RequestOptions();
    return this.http.get(finalUrl, options)
      .map((response: Response) => {
        return response;
      })
       .catch((error:any) => 
         Observable.throw(error)
    );
  }
}
