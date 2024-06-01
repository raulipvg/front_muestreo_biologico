import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/env';

export interface IEspecieModel {
  id: number;
  nombre?: null | string;
  enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  talla_min? : number;
  talla_max? : number;
  peso_min? : number;
  peso_max? : number;
  flag?:boolean;
  tipo1: number;
}

@Injectable({
  providedIn: 'root'
})
export class EspeciesService {

  constructor(private http: HttpClient) { }
  url = env.API_URL + 'especie'
  
  getAll(): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json'
      }),
      withCredentials: true
    };
    return this.http.get(this.url+'/getall', options );
  }

  getAllActivos(): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json'
      }),
      withCredentials: true
    };
    return this.http.get(this.url+'/getall/1', options );
  }

  get(id: number): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json'
      }),
      withCredentials: true
    };
    const url = `${this.url}/get/${id}`;
    return this.http.get<IEspecieModel>(url, options );
  }

  update( data: any): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json'
      }),
      withCredentials: true
    };
    const url = `${this.url}/update`;
    return this.http.post<IEspecieModel>(url, data, options);
  }

  cambiarestado(id: number): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json'
      }),
      withCredentials: true
    };
    return this.http.post(this.url+'/cambiarestado/', {id}, options);
  }

  crear(data: any): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json'
      }),
      withCredentials: true
    };
    return this.http.post<IEspecieModel>(this.url+'/create/', data,options);
  }
}
