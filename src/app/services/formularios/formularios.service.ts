import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, throwError } from 'rxjs';
import { env } from 'src/environments/env';
import { getOptions, handleError } from '../global';
import { catchError } from 'rxjs/operators';


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
  formulariosSubject = new BehaviorSubject<any>(undefined);
  url = env.API_URL + 'formulario';


  constructor(private http: HttpClient) {
    
    this.loadFormulariosEnabled();
  }

  get formularioEnabled() : any {
    return this.formulariosSubject.value;
  }

  
  private loadFormulariosEnabled(): void {
    this.getFormulariosEnabled().subscribe();
  }

  getAll(): Observable<any> {
    const options = getOptions();
    return this.http.get(this.url+'/getall', options )
                    .pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                    );
  }
  get(id: number): Observable<any> {
    const options = getOptions();
    const url = `${this.url}/get/${id}`;
    return this.http.get<IFormularioModel>(url, options )
                    .pipe(
                        catchError((error: HttpErrorResponse) => {
                          if(error.status === 400){handleError();}
                          return throwError(() =>error);
                        })
                    );
  }

  update( data: any): Observable<any> {
    const options = getOptions();
    const url = `${this.url}/update`;
    this.formularioEnabled.find((a:any)=>a.id == data.id).enabled = data.enabled;
    return this.http.post<IFormularioModel>(url, data, options)
                    .pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                  );
  }

  cambiarestado(id: number): Observable<any> {
    const options = getOptions();
    let elemento = this.formulariosSubject.value.find((a:any) => a.id == id);
    elemento.enabled = !elemento.enabled;
    return this.http.post(this.url+'/cambiarestado/', {id}, options)
                    .pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                  );
  }

  getselects(): Observable<any> {
    const options = getOptions();
    return this.http.get(this.url+'/getselects', options)
                    .pipe(
                      catchError((error: HttpErrorResponse) => {
                        if(error.status === 400){handleError();}
                        return throwError(() =>error);
                      })
                  );
  }

  getFormulariosEnabled(id?: number): Observable<any> {
    const options = getOptions();
    if(id){
      return this.http.get(`${this.url}/getenabled/${id}`, options)
    }else{
      return this.http.get(`${this.url}/getenabled/`, options)
      .pipe(
        tap((data) => this.formulariosSubject.next(data)), // Actualizar BehaviorSubject con la respuesta de la API
        catchError((error) => {
          //console.error('Error obteniendo formularios:', error);
          return of(null); // Retornar un observable vacío en caso de error
        })
      );
    }
  }

}
