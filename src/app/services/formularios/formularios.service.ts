import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/env';


export interface IFormularioModel {
  id: number;
  titulo?: null | string;
  descripcion?: null |string;
  enabled?: boolean;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {

  constructor(private http: HttpClient) { }
  url = env.API_URL + 'formulario';
  
  getAll(): Observable<any> {
    return this.http.get(this.url+'/getall');
  }

  get(id: number): Observable<IFormularioModel> {
    const url = `${this.url}/get/${id}`;
    return this.http.get<IFormularioModel>((url));
  }

  update( data: any): Observable<IFormularioModel> {
    const url = `${this.url}/update`;
    return this.http.post<IFormularioModel>(url, data);
  }

  cambiarestado(id: number): Observable<any> {
    return this.http.post(this.url+'/cambiarestado/', {id});
  }

  getselects(): Observable<any> {
    return this.http.get(this.url+'/getselects');
  }
}
