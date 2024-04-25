import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/env';


export interface ILugarmModel {
  id: number;
  nombre?: null | string;
  enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LugaresmService {

  constructor(private http: HttpClient) { }
  url = env.API_URL + 'lugarm'
  
  getAll(): Observable<any> {
    return this.http.get(this.url+'/getall');
  }

  get(id: number): Observable<ILugarmModel> {
    const url = `${this.url}/get/${id}`;
    return this.http.get<ILugarmModel>((url));
  }

  update( data: any): Observable<ILugarmModel> {
    const url = `${this.url}/update`;
    return this.http.post<ILugarmModel>(url, data);
  }

  cambiarestado(id: number): Observable<any> {
    return this.http.post(this.url+'/cambiarestado/', {id});
  }

  crear(data: any): Observable<ILugarmModel> {
    return this.http.post<ILugarmModel>(this.url+'/create/', data);
  }
}
