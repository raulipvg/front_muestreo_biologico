import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from 'src/environments/env';

export interface ICredencialesModel {
  username: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = 'http://localhost:8000/api/login';
  constructor(private http: HttpClient) { }

  normal( data: any){
    this.http.get(env.CSRF_COOKIE_URL);
    return this.http.post<ICredencialesModel>(this.url, data);
  }

  google(){
    return this.http.get(this.url + '/google/redirect');
  }
}
