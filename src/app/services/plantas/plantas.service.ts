import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/env';

const headers = new HttpHeaders({
  'ngrok-skip-browser-warning': 'any-value',
  'Accept':'*/*'
});

export interface IPlantaModel {
  id: number;
  nombre?: null | string;
  enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlantasService {

  constructor(private http: HttpClient) { }
  url = env.API_URL + 'planta'
  
  getAll(): Observable<any> {
    return this.http.get(this.url+'/getall', {headers} );
  }

  getAllActivos(): Observable<any> {
    return this.http.get(this.url+'/getall/1', {headers} );
  }

  get(id: number): Observable<IPlantaModel> {
    const url = `${this.url}/get/${id}`;
    return this.http.get<IPlantaModel>(url, {headers} );
  }

  update( data: any): Observable<IPlantaModel> {
    const url = `${this.url}/update`;
    return this.http.post<IPlantaModel>(url, data);
  }

  cambiarestado(id: number): Observable<any> {
    return this.http.post(this.url+'/cambiarestado/', {id});
  }

  crear(data: any): Observable<IPlantaModel> {
    return this.http.post<IPlantaModel>(this.url+'/create/', data);
  }
}
