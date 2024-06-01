import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/env';

const headers = new HttpHeaders({
  'ngrok-skip-browser-warning': 'any-value',
  'Accept':'*/*'
});


export interface IDepartamentoModel {
  id: number;
  nombre?: null | string;
  enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  constructor(private http: HttpClient) { }
  url = env.API_URL + 'departamento'
  
  getAll(): Observable<any> {
    
    const options : any = {
      headers : new HttpHeaders({
        'ngrok-skip-browser-warning': 'any-value',
        'Accept': 'application/json'
        }),
      withCredentials : true
    };
    return this.http.get(this.url+'/getall', options );
  }

  get(id: number): Observable<any> {
    
  const options : any = {
    headers : new HttpHeaders({
      'ngrok-skip-browser-warning': 'any-value',
      'Accept': 'application/json'
      }),
    withCredentials : true
  };
    const url = `${this.url}/get/${id}`;
    return this.http.get<IDepartamentoModel>(url, options );
  }

  update( data: any): Observable<any> {
    
    const options : any = {
      headers : new HttpHeaders({
        'ngrok-skip-browser-warning': 'any-value',
        'Accept': 'application/json'
        }),
      withCredentials : true
    };

    const url = `${this.url}/update`;
    return this.http.post<IDepartamentoModel>(url, data, options);
  }

  cambiarestado(id: number): Observable<any> {
    
    const options : any = {
      headers : new HttpHeaders({
        'ngrok-skip-browser-warning': 'any-value',
        'Accept': 'application/json'
        }),
      withCredentials : true
    };
    return this.http.post(this.url+'/cambiarestado/', {id}, options);
  }

  crear(data: any): Observable<any> {
    
  const options : any = {
    headers : new HttpHeaders({
      'ngrok-skip-browser-warning': 'any-value',
      'Accept': 'application/json'
      }),
    withCredentials : true
  };
    return this.http.post<IDepartamentoModel>(this.url+'/create/', data,options);
  }
}
