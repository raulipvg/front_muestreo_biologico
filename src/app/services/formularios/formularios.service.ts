import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { CookieComponent } from 'src/app/_metronic/kt/components/_CookieComponent';
import { env } from 'src/environments/env';

const headers = new HttpHeaders({
  'ngrok-skip-browser-warning': 'any-value',
  'Accept':'*/*'
});
const options : any = {
  headers : new HttpHeaders({
    'ngrok-skip-browser-warning': 'any-value',
    'Accept': 'application/json',
    'X-XSRF-TOKEN': CookieComponent.get('XSRF-TOKEN')!
    }),
  withCredentials : true
}

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
  formularios$: Observable<any>;
  formulariosSubject: BehaviorSubject<any>;


  constructor(private http: HttpClient) { 
    this.formulariosSubject = new BehaviorSubject<any>(undefined);
    this.formularios$ = this.formulariosSubject.asObservable();
  }

  get formularioEnabled() : any {
    return this.formulariosSubject.value;
  }

  url = env.API_URL + 'formulario';
  
  getAll(): Observable<any> {
    return this.http.get(this.url+'/getall', {headers} );
  }

  get(id: number): Observable<IFormularioModel> {
    const url = `${this.url}/get/${id}`;
    return this.http.get<IFormularioModel>(url, {headers} );
  }

  update( data: any): Observable<any> {
    const url = `${this.url}/update`;
    this.formularioEnabled.find((a:any)=>a.id == data.id).enabled = data.enabled;
    return this.http.post<IFormularioModel>(url, data, options);
  }

  cambiarestado(id: number): Observable<any> {
    let elemento = this.formulariosSubject.value.find((a:any) => a.id == id);
    elemento.enabled = !elemento.enabled;
    return this.http.post(this.url+'/cambiarestado/', {id}, options);
  }

  getselects(): Observable<any> {
    return this.http.get(this.url+'/getselects', {headers} );
  }

  getFormulariosEnabled(): Observable<any> {
    return this.http.get(this.url + '/getenabled', { headers })
      .pipe(
        tap((data) => this.formulariosSubject.next(data)), // Actualizar BehaviorSubject con la respuesta de la API
        catchError((error) => {
          console.error('Error obteniendo formularios:', error);
          return of(null); // Retornar un observable vacío en caso de error
        })
      );
  }
}
