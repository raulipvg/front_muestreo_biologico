import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {

  constructor(private http: HttpClient) { }
  url = 'http://127.0.0.1:8000/api/formulario';
  getAll(): Observable<any> {
    return this.http.get(this.url+'/getall');
  }

  get(id: number): Observable<any> {
    return this.http.get(this.url+'/get/'+id);
  }

  update( data: any): Observable<any> {
    return this.http.post(this.url+'/update/', data);
  }

  cambiarestado(id: number): Observable<any> {
    return this.http.post(this.url+'/cambiarestado/', {id});
  }

}
