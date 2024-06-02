import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { env } from 'src/environments/env';
import { getOptions, getOptionsWithParams, handleError } from '../global';
import { catchError } from 'rxjs/operators';


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
    const options : any = getOptions();
    return this.http.get(this.url + '/getall', options ).pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                    );
  }

  getAllbyFormulario(id:number): Observable<any> {
    const options : any = getOptions();
    return this.http.get(this.url + '/getall/' + id, options ).pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                    );
  }

  get(id:number): Observable<any> {
    const options : any = getOptions();
    return this.http.get(`${this.url}/get/${id}`, options ).pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                    );
  }

  update(data:any, imagen:any): Observable<any> {
    const params = { data:  JSON.stringify(data) };
    const options : any = getOptionsWithParams(params);
    return this.http.post<any>(this.url + '/update', imagen,options).pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                    );
  }

  create(data : any, imagen: any): Observable<any> {
    const params = { data:  JSON.stringify(data) };
    const options : any = getOptionsWithParams(params);
    return this.http.post<any>(this.url + '/create', imagen,options).pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                    );
  }

  cambiarestado(id: number): Observable<any> {
    const options : any = getOptions();
    return this.http.post(this.url+'/cambiarestado/', {id},options).pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                    );
  }
  
}

