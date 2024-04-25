import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/env';


export interface IPersonaModel {
  id: number;
  nombre?: null | string;
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
    return this.http.get(this.url+'/getall');
  }

  get(id: number): Observable<IPersonaModel> {
    const url = `${this.url}/get/${id}`;
    return this.http.get<IPersonaModel>((url));
  }

  update( data: any): Observable<IPersonaModel> {
    const url = `${this.url}/update`;
    return this.http.post<IPersonaModel>(url, data);
  }

  cambiarestado(id: number): Observable<any> {
    return this.http.post(this.url+'/cambiarestado/', {id});
  }

  crear(data: any): Observable<IPersonaModel> {
    return this.http.post<IPersonaModel>(this.url+'/create/', data);
  }
}
