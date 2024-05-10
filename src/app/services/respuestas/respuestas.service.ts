import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/env';

const headers = new HttpHeaders({
  'ngrok-skip-browser-warning': 'any-value',
  'Accept':'*/*'
});
export  interface IRespuestaModel {
  id?: number;
  formulario_id: number;
  json: any;
  enabled?: boolean;
  usuario_id?: number;
}
@Injectable({
  providedIn: 'root'
})
export class RespuestasService {
  

  constructor(private http: HttpClient) { }
  url = env.API_URL + 'respuesta';

  getAll(): Observable<any> {
    return this.http.get(this.url + '/getall', {headers} );
  }

  getAllbyFormulario(id:number): Observable<any> {
    return this.http.get(this.url + '/getall/' + id, {headers} );
  }

  get(id:number): Observable<any> {
    return this.http.get(`${this.url}/get/${id}`, {headers} );
  }

  update(data:any, imagen:any): Observable<any> {
    const params = { data:  JSON.stringify(data) };  
    return this.http.post<any>(this.url + '/update', imagen,{headers:headers, params: params});
  }

  create(data : any, imagen: any): Observable<any> {
    const params = { data:  JSON.stringify(data) };
    return this.http.post<any>(this.url + '/create', imagen,{headers:headers, params: params});
  }

  cambiarestado(id: number): Observable<any> {
    return this.http.post(this.url+'/cambiarestado/', {id});
  }
  
}

