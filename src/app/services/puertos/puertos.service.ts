import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/env';


export interface IPuertoModel {
  id: number;
  nombre?: null | string;
  enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PuertosService {

  constructor(private http: HttpClient) { }
  url = env.API_URL + 'puerto'
  
  getAll(): Observable<any> {
    return this.http.get(this.url+'/getall');
  }

  get(id: number): Observable<IPuertoModel> {
    const url = `${this.url}/get/${id}`;
    return this.http.get<IPuertoModel>((url));
  }

  update( data: any): Observable<IPuertoModel> {
    const url = `${this.url}/update`;
    return this.http.post<IPuertoModel>(url, data);
  }

  cambiarestado(id: number): Observable<any> {
    return this.http.post(this.url+'/cambiarestado/', {id});
  }

  crear(data: any): Observable<IPuertoModel> {
    return this.http.post<IPuertoModel>(this.url+'/create/', data);
  }
}
