import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.http.get(this.url+'/getall');
  }

  get(id: number): Observable<IFlotaModel> {
    const url = `${this.url}/get/${id}`;
    return this.http.get<IFlotaModel>((url));
  }

  update( data: any): Observable<IFlotaModel> {
    const url = `${this.url}/update`;
    return this.http.post<IFlotaModel>(url, data);
  }

  cambiarestado(id: number): Observable<any> {
    return this.http.post(this.url+'/cambiarestado/', {id});
  }
}
