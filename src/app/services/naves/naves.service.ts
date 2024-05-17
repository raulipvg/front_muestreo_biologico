import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieComponent } from 'src/app/_metronic/kt/components';
import { env } from 'src/environments/env';

const headers = new HttpHeaders({
  'ngrok-skip-browser-warning': 'any-value',
  'Accept':'*/*'
});

export interface INaveModel {
  id: number;
  nombre?: null | string;
  enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  flota_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NavesService {

  constructor(private http: HttpClient) { }
  url = env.API_URL + 'nave';

  getAll(): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    }
    return this.http.get(this.url+'/getall', options );
  }
  
  getAllActivos(): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    }
    return this.http.get(this.url+'/getall/1', options );
  }

  get(id: number): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    }
    const url = `${this.url}/get/${id}`;
    return this.http.get<INaveModel>(url, options );
  }

  update( data: any): Observable<INaveModel> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    }
    const url = `${this.url}/update`;
    return this.http.post<INaveModel>(url, data, options);
  }

  cambiarestado(id: number): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    }
    return this.http.post(this.url+'/cambiarestado/', {id}, options);
  }

  crear(data: any): Observable<INaveModel> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    }
    return this.http.post<INaveModel>(this.url+'/create/', data, options);
  }
}
