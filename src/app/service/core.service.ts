import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Promise } from 'q';

@Injectable()
export class CoreService {
  constructor(private http: Http) {}

  getConfig(args: { path?: string, query?: string }): Observable<Response> {
    let finalUrl = args.path;

    if (args.query) {
      finalUrl += args.query;
    }

    const options = new RequestOptions();
    return this.http.get(finalUrl, options)
      .map((response: Response) => {
        return response.json();
      })
       .catch((error:any) => 
         Observable.throw(new Error(error))
    );
  }

  postConfig(args: { path: string, data: any }): Observable<Response> {
    const finalUrl = args.path;
    var headers = new Headers();
    headers.append("content-type", "application/json");
    const options = new RequestOptions();
    options.headers = headers;
    return this.http.post(finalUrl, args.data, options)
      .map((response: Response) => {
        return response.json();
      })
      .catch((error: any) =>
        Observable.throw(new Error(error))
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
         Observable.throw(new Error(error))
    );
  }
}
