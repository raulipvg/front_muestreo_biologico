import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieComponent } from 'src/app/_metronic/kt/components/_CookieComponent';
import { env } from 'src/environments/env';

export interface ILugarmModel {
  id: number;
  nombre?: null | string;
  enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LugaresmService {

  constructor(private http: HttpClient) { }
  url = env.API_URL + 'lugarm'
  
  getAll(): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    };
    return this.http.get(this.url+'/getall', options );
  }

  get(id: number): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    };
    const url = `${this.url}/get/${id}`;
    return this.http.get<ILugarmModel>(url,options );
  }

  update( data: any): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    };
    const url = `${this.url}/update`;
    return this.http.post<ILugarmModel>(url, data,options);
  }

  cambiarestado(id: number): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    };
    return this.http.post(this.url+'/cambiarestado/', {id},options);
  }

  crear(data: any): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    };
    return this.http.post<ILugarmModel>(this.url+'/create/', data,options);
  }
}
