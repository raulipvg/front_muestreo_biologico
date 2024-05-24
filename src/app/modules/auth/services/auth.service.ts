import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { Router } from '@angular/router';
import { CookieComponent } from 'src/app/_metronic/kt/components';
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

    return this.http.get(env.CSRF_COOKIE_URL, options).pipe(
      switchMap(() => {
        const csrfToken = CookieComponent.get('XSRF-TOKEN')!;
        const loginOptions: any = {
          headers: new HttpHeaders({
            'ngrok-skip-browser-warning': 'any-value',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': csrfToken
          }),
          withCredentials: true
        };
        return this.http.post<{ user: UserType }>(env.LOGIN_URL, { email, password }, loginOptions).pipe(
          map((result : any) => {
            if (result && result.usuario) {
              this.storeTokens(result);
              result.usuario.pic = './assets/media/logos/logo-cc-web-small-dark.png';
              this.currentUserSubject.next(result.usuario);
              return result.usuario;
            } else {
              throw new Error('Credenciales incorrectas');
            }
          })
        );
      }),
      catchError((err) => {
        console.error('Login error:', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  google(){
    const options : any = {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'any-value',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': CookieComponent.get('XSRF-TOKEN')!
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
        //console.log(data)
        this.deleteCookies();
        this.router.navigate(['/auth/login']);
        return of(undefined);
      }
    });
  }

  private storeTokens(result: any) {
    let expTime = new Date();
    expTime = new Date(expTime.getTime() + 60*60*10000);
    CookieComponent.set('userToken', result.token, { Expires: expTime });
    CookieComponent.set('permisosF', result.permisosF, { Expires: expTime });
    CookieComponent.set('permisosM', result.permisosM, { Expires: expTime });
  }

  logout() {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    }
    return this.http.post(env.LOGOUT_URL, null, options).pipe(
      tap(() => {
        this.deleteCookies();
        this.router.navigate(['/auth/login'], {
          queryParams: {},
        });
      })
    );
  }

  getUserByToken(): Observable<UserType> {
    const auth = CookieComponent.get('userToken');
    const xsrf = CookieComponent.get('XSRF-TOKEN');
    if (!auth || auth === 'undefined') {
      if(window.location.pathname.includes('google/callback')){
        return of(undefined);
      }
      this.deleteCookies();
      this.router.navigate(['/auth/login']);
      return of(undefined);
    }
    if (!xsrf || xsrf === 'undefined') {
      this.deleteCookies();
      this.router.createUrlTree(['/auth/login']);
      //this.router.navigate(['/auth/login']);
      return of(undefined);
    }
    const loginOptions: any = {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'any-value',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': xsrf
      }),
      withCredentials: true
    };

    this.isLoadingSubject.next(true);
    return this.http.get<UserType>(env.USER_URL,loginOptions).pipe(
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
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
/*
  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
*/
  //eliminar cookies
  deleteCookies(){
    CookieComponent.delete('userToken');
    CookieComponent.delete('permisosF');
    CookieComponent.delete('permisosM');
    CookieComponent.delete('kt_app_sidebar_menu_scrollst');
    localStorage.removeItem('v8.2.3-authf649fc9a5f55');
    localStorage.removeItem('dark-sidebar-v8.2.3-layoutConfig');
    localStorage.removeItem('v8.2.3-baseLayoutType');

  }
  // private methods
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
