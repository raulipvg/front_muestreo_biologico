import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SwApiService {

  constructor(private http: HttpClient) {}

  getMovies() {
    return this.http.get('https://swapi.dev/api/films');
  }
}