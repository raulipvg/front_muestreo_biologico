import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RespuestasService {
  

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/respuesta/getall');
  }

  getOne(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/respuesta/getone');
  }

  editOne(): Observable<any> {  
    return this.http.get('http://127.0.0 .1:8000/api/respuesta/edit');
  }


  
}

