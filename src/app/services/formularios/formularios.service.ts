import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {

  constructor(private http: HttpClient) { }
  url = 'https://cub-balanced-slowly.ngrok-free.app/api/formulario';
  getAll(): Observable<any> {
    return this.http.get(this.url+'/getall');
  }

  getOne(id: number): Observable<any> {
    return this.http.get(this.url+'/get/'+id);
  }

}
