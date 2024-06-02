import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { env } from 'src/environments/env';
import { getOptions, handleError } from '../global';
import { catchError } from 'rxjs/operators';

export interface IFlotaModel {
  id: number;
  nombre?: null | string;
  enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlotasService {

  constructor(private http: HttpClient) { }
  url = env.API_URL + 'flota'
  
  getAll(): Observable<any> {
    const options : any = getOptions();
    return this.http.get(this.url+'/getall', options ).pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                    );
  }

  get(id: number): Observable<any> {
    const options : any = getOptions();
    const url = `${this.url}/get/${id}`;
    return this.http.get<IFlotaModel>(url, options ).pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                    );
  }

  update( data: any): Observable<any> {
    const options : any = getOptions();
    const url = `${this.url}/update`;
    return this.http.post<IFlotaModel>(url, data, options).pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                    );
  }

  cambiarestado(id: number): Observable<any> {
    const options : any = getOptions();
    return this.http.post(this.url+'/cambiarestado/', {id}, options).pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                    );
  }

  crear(data: any): Observable<any> {
    const options : any = getOptions();
    return this.http.post<IFlotaModel>(this.url+'/create/', data, options).pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                    );
  }
}
