import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/env';


export interface INaveModel {
  id: number;
  nombre?: null | string;
  enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavesService {

  constructor(private http: HttpClient) { }
  url = env.API_URL + 'nave';

  getAll(): Observable<any> {
    return this.http.get(this.url+'/getall');
  }
  
  getAllActivos(): Observable<any> {
    return this.http.get(this.url+'/getall/1');
  }

  get(id: number): Observable<INaveModel> {
    const url = `${this.url}/get/${id}`;
    return this.http.get<INaveModel>((url));
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
