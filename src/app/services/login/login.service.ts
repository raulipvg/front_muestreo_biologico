import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from 'src/environments/env';
import { CookieComponent } from 'src/app/_metronic/kt/components';
import { Observable, switchMap, tap } from 'rxjs';


export interface ICredencialesModel {
  username: string,
  password: string,
  token?: string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
/*
  El header de 'ngrok-skip-browser-warning' es de uso exclusivamente para el cliente ngrok!! Eliminar para producción
*/
  options : any = {
    headers : new HttpHeaders({
      'ngrok-skip-browser-warning': 'any-value',
      'Accept': 'application/json'
      }),
    withCredentials : true
  }

  url = 'http://localhost:8000/';
  constructor(private http: HttpClient) { }

  normal(data: any){

  return this.http.get(env.CSRF_COOKIE_URL, this.options)
    .pipe(
      tap({
        next: () => {
          this.options.headers = this.options.headers.append('X-XSRF-TOKEN', CookieComponent.get('XSRF-TOKEN'));
        },
      }),
      switchMap(() => {
        return this.http.post<ICredencialesModel>(this.url + 'login', data, this.options);
      })
    );
  }

  logout(userToken:any){
    const options = {
      headers : new HttpHeaders({
        'Authorization' : 'Bearer='+userToken,
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    }
    return this.http.post(this.url + 'logout',null,options);
  }

  autenticado():boolean{
    return CookieComponent.get('userToken') ? true : false;
  }
}
