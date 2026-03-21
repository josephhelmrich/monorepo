import { environment } from './../../environments/environment';
import { HttpClient } from "@angular/common/http"
import { Observable, of } from 'rxjs';
import { ApiSettings } from './api-settings';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ApiClient {
    constructor(private http: HttpClient, private env: ApiSettings) {
    }

    post<T>(relativeUrl: string, requestBody: any|null = null): Observable<T> {
      var url = `${this.env.apiUrl}${relativeUrl}`;
      return this.http.post<T>(url, requestBody);
    }


    put<T>(relativeUrl: string, requestBody: any|null=null): Observable<T> {
      var url = `${this.env.apiUrl}${relativeUrl}`;
      return this.http.put<T>(url, requestBody);
    }

    get<T>(relativeUrl: string): Observable<T> {
      var url = `${this.env.apiUrl}${relativeUrl}`;
      return this.http.get<T>(url);
    }
    // post<T>(relativeUrl: string, requestBody: any): Observable<any> {
    //   var url = `${relativeUrl}`;
    //   return of(null);
    //   //return this.http.post<T>(url, requestBody);
    // }

}
