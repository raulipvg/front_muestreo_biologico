import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


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
  url = 'https://cub-balanced-slowly.ngrok-free.app/api/formulario';
  //url = 'http://127.0.0.1:8000/api/formulario';
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

}
