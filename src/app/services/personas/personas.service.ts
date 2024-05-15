import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieComponent } from 'src/app/_metronic/kt/components';
import { env } from 'src/environments/env';

const headers = new HttpHeaders({
  'ngrok-skip-browser-warning': 'any-value',
  'Accept':'*/*'
});

export interface IPersonaModel {
  id: number;
  nombre?: null | string;
  apellido?: null | string;
  rut?: null | string;
  enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  constructor(private http: HttpClient) { }
  url = env.API_URL + 'persona'
  
  getAll(): Observable<any> {
    return this.http.get(this.url+'/getall', {headers} );
  }

  get(id: number): Observable<IPersonaModel> {
    const url = `${this.url}/get/${id}`;
    return this.http.get<IPersonaModel>(url, {headers} );
  }

  update( data: any): Observable<IPersonaModel> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    }
    const url = `${this.url}/update`;
    return this.http.post<IPersonaModel>(url, data, options);
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

  crear(data: any): Observable<IPersonaModel> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    }
    return this.http.post<IPersonaModel>(this.url+'/create/', data, options);
  }
}
