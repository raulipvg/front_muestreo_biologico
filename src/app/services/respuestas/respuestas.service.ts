import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/env';

@Injectable({
  providedIn: 'root'
})
export class RespuestasService {
  

  constructor(private http: HttpClient) { }
  url = env.API_URL + 'respuesta';

  getAll(): Observable<any> {
    return this.http.get(this.url + '/getall');
  }

  getOne(): Observable<any> {
    return this.http.get(this.url + '/getone');
  }

  editOne(): Observable<any> {  
    return this.http.get(this.url + '/edit');
  }


  
}

