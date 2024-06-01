import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription, throwError } from 'rxjs';
import { map, catchError, switchMap, finalize, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { Router } from '@angular/router';
import { env } from 'src/environments/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }
/*
  // public methods
  login(email: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: AuthModel) => {
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }*/

  login(email: string, password: string): Observable<UserType> {
    const options: any = {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'any-value',
        'Accept': 'application/json'
      }),
      withCredentials: true
    };
    this.isLoadingSubject.next(true);
    return this.http.post<{ user: UserType }>(env.API_URL + 'login', { email, password }, options).pipe(
      map((result : any) => {
        if (result && result.usuario) {
          this.storeTokens(result);
          result.usuario.pic = './assets/media/logos/logo-cc-web-small-dark.png';
          this.currentUserSubject.next(result.usuario);
          return result.usuario;
        } else {
          throw new Error('Credenciales incorrectas');
        }
      },
      finalize(() => this.isLoadingSubject.next(false)))
    );
    
  }

  google(){
    const options : any = {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'any-value',
        'Accept': 'application/json'
      }),
      withCredentials: true
    }
    this.http.get(`${env.GOOGLE_CALLBACK_URL+location.search}`,options).subscribe({
      next: (data:any)=>{
        this.storeTokens(data);
        data.usuario.pic = './assets/media/logos/logo-cc-web-small-dark.png';
        this.currentUserSubject.next(data.usuario);
        this.router.navigate(['/']);
        return of(undefined);
      },
      error: (data:any)=>{
        this.deleteStorage();
        this.router.navigate(['/auth/login']);
        return of(undefined);
      }
    });
  }

  private storeTokens(result: any) {
    let expTime = new Date();
    expTime = new Date(expTime.getTime() + 60*60*10000);
    localStorage.setItem('userToken', result.token);
    localStorage.setItem('permisosF', result.permisosF);
    localStorage.setItem('permisosM', result.permisosM);
  }

  logout() {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'authorization' : 'Bearer '+localStorage.getItem('userToken')!
      }),
      withCredentials: true
    }
    return this.http.post(env.API_URL + 'logout', null, options).pipe(
      tap(async () => {
        await this.deleteStorage();
        this.router.navigate(['/auth/login'], { queryParams: {} });
      }),
      catchError(error => {
        this.deleteStorage();
        return throwError('Logout failed. Please try again.');
      })
    );
  }

  getUserByToken(): Observable<UserType> {
    let auth = localStorage.getItem('userToken');
    if (!auth || auth === 'undefined') {
      if(window.location.pathname.includes('google/callback')){
        return of(undefined);
      }
      this.deleteStorage();
      this.router.navigate(['/auth/login']);
      return of(undefined);
    }
    let loginOptions: any = {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'any-value',
        'Accept': 'application/json',
        'authorization' : 'Bearer '+localStorage.getItem('userToken')!
      }),
      withCredentials: true
    };

    this.isLoadingSubject.next(true);
    return this.http.get<UserType>(env.API_URL+'persona/getuser',loginOptions).pipe(
      map((data: any) => {
        if (data.usuario) {
          data.usuario.pic = './assets/media/logos/logo-cc-web-small-dark.png';
          this.currentUserSubject.next(data.usuario);
          this.storeTokens(data);
        } else {
          this.logout();
        }
        return data.usuario;
      }),
      catchError(error =>{
        this.deleteStorage();
        return throwError('Logout failed. Please try again.');
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  //eliminar storage
  deleteStorage(){
    localStorage.clear()

  }
  // private methods
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
