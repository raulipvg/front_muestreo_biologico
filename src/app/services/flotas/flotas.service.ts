import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieComponent } from 'src/app/_metronic/kt/components/_CookieComponent';
import { env } from 'src/environments/env';

export interface IFlotaModel {
  id: number;
  nombre?: null | string;
  enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlotasService {

  constructor(private http: HttpClient) { }
  url = env.API_URL + 'flota'
  
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
    return this.http.get<IFlotaModel>(url, options );
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
    return this.http.post<IFlotaModel>(url, data, options);
  }

  cambiarestado(id: number): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    };
    return this.http.post(this.url+'/cambiarestado/', {id}, options);
  }

  crear(data: any): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    };
    return this.http.post<IFlotaModel>(this.url+'/create/', data, options);
  }
}
