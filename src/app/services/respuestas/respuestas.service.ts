import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieComponent } from 'src/app/_metronic/kt/components';
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
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    }
    return this.http.get(this.url + '/getall', options );
  }

  getAllbyFormulario(id:number): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    }
    return this.http.get(this.url + '/getall/' + id, options );
  }

  get(id:number): Observable<any> {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    }
    return this.http.get(`${this.url}/get/${id}`, options );
  }

  update(data:any, imagen:any): Observable<any> {
    const params = { data:  JSON.stringify(data) };
    const options : any = {
      headers : new HttpHeaders({
        'ngrok-skip-browser-warning': 'any-value',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': CookieComponent.get('XSRF-TOKEN')!
        }),
      withCredentials : true,
      params : params
    }  
    return this.http.post<any>(this.url + '/update', imagen,options);
  }

  create(data : any, imagen: any): Observable<any> {
    const params = { data:  JSON.stringify(data) };
    const options : any = {
      headers : new HttpHeaders({
        'ngrok-skip-browser-warning': 'any-value',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': CookieComponent.get('XSRF-TOKEN')!
        }),
      withCredentials : true,
      params : params
    }
    return this.http.post<any>(this.url + '/create', imagen,options);
  }

  cambiarestado(id: number): Observable<any> {
    const options : any = {
      headers : new HttpHeaders({
        'ngrok-skip-browser-warning': 'any-value',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': CookieComponent.get('XSRF-TOKEN')!
        }),
      withCredentials : true
    }
    return this.http.post(this.url+'/cambiarestado/', {id},options);
  }
  
}

