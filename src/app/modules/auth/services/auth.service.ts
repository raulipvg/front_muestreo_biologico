import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
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
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

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
    private authHttpService: AuthHTTPService,
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

  private storeTokens(result: any) {
    const veryFarFuture = new Date();
    veryFarFuture.setFullYear(2147, 11, 31);
    CookieComponent.set('userToken', result.token, { Expires: veryFarFuture });
    CookieComponent.set('permisosF', result.permisosF, { Expires: veryFarFuture });
    CookieComponent.set('permisosM', result.permisosM, { Expires: veryFarFuture });
  }

  logout() {
    const options = {
      headers : new HttpHeaders({
        'Accept': 'application/json',
        'X-XSRF-TOKEN' : CookieComponent.get('XSRF-TOKEN')!,
      }),
      withCredentials: true
    }
    return this.http.post(env.LOGOUT_URL,null,options).pipe();
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserType> {
    const auth = CookieComponent.get('userToken');
    if (!auth || auth === 'undefined') {
      this.router.navigate(['/auth/login']);
      return of(undefined);
    }
    const loginOptions: any = {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'any-value',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': CookieComponent.get('XSRF-TOKEN')!
      }),
      withCredentials: true
    };

    this.isLoadingSubject.next(true);
    return this.http.get<UserType>(env.USER_URL,loginOptions).pipe(
      map((data: any) => {
        if (data.usuario) {
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
  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.authToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(CookieComponent.get('userToken')!);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
