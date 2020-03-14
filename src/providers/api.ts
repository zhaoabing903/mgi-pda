import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  public plant = 'MG01';
  public version = 'T-191230';
  // public api_host = 'http://localhost:49280';
  public api_host: string = 'http://localhost/lesapi';
  // public api_host: string = 'http://10.1.126.171/lesapi';
  // public api_host: string = 'http://10.34.243.14/lesapi';

  url: string = this.api_host + '/api';


  constructor(
    public http: HttpClient,
    // public cdr:ChangeDetectorRef,
  ) {

  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          reqOpts.params = reqOpts.params.set(key, params[key]);
        }
      }
    }
    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }
}
