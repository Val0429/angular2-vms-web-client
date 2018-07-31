import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Response, RequestOptions } from '@angular/http';

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
         Observable.throw(new Error(`{ "message": "error", "body" : "` + error._body + `"}`))
    );
  }

  postConfig(args: { path: string, data: any }): Observable<Response> {
    const finalUrl = args.path;

    const options = new RequestOptions();
    return this.http.post(finalUrl, args.data, options)
      .map((response: Response) => {
        return response.json();
      })
      .catch((error:any) => 
        Observable.throw(
          new Error(`{ "message": "error", "body" : "` + error._body + `"}`)
        )
    );
  }

  getImage(args: { path: string }) {
    let finalUrl = args.path;

    const options = new RequestOptions();
    return this.http.get(finalUrl, options)
      .map((response: Response) => {
        return response;
      })
      .catch((error: any) => {
        return JSON.parse(`{ "message": "error", "body" : "` + error._body + `"}`);
      }
    );
  }
}
