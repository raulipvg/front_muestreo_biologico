import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.http.get(this.url+'/getall', {headers} );
  }
  
  getAllActivos(): Observable<any> {
    return this.http.get(this.url+'/getall/1', {headers} );
  }

  get(id: number): Observable<INaveModel> {
    const url = `${this.url}/get/${id}`;
    return this.http.get<INaveModel>(url, {headers} );
  }

  update( data: any): Observable<INaveModel> {
    const url = `${this.url}/update`;
    return this.http.post<INaveModel>(url, data);
  }

  cambiarestado(id: number): Observable<any> {
    return this.http.post(this.url+'/cambiarestado/', {id});
  }

  crear(data: any): Observable<INaveModel> {
    return this.http.post<INaveModel>(this.url+'/create/', data);
  }
}
