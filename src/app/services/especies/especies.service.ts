import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/env';

const headers = new HttpHeaders({
  'ngrok-skip-browser-warning': 'any-value',
  'Accept':'*/*'
});

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
    return this.http.get(this.url+'/getall', {headers} );
  }

  getAllActivos(): Observable<any> {
    return this.http.get(this.url+'/getall/1', {headers} );
  }

  get(id: number): Observable<IEspecieModel> {
    const url = `${this.url}/get/${id}`;
    return this.http.get<IEspecieModel>(url, {headers} );
  }

  update( data: any): Observable<IEspecieModel> {
    const url = `${this.url}/update`;
    return this.http.post<IEspecieModel>(url, data);
  }

  cambiarestado(id: number): Observable<any> {
    return this.http.post(this.url+'/cambiarestado/', {id});
  }

  crear(data: any): Observable<IEspecieModel> {
    return this.http.post<IEspecieModel>(this.url+'/create/', data);
  }
}
