import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { toJSON } from 'src/app/_metronic/kt/_utils';
import { CookieComponent } from 'src/app/_metronic/kt/components';

@Component({
  selector: 'app-gcallback',
  standalone: true,
  imports: [],
  templateUrl: './gcallback.component.html'
})
export class GcallbackComponent implements OnInit{
  
  options : any = {
    headers : new HttpHeaders({
      'ngrok-skip-browser-warning': 'any-value',
      'Accept': 'application/json'
      }),
    withCredentials : true
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.http.get(`http://localhost:8000/login/google/callback${location.search}`,this.options).subscribe({
      next: (data:any)=>{
        console.log(data);
        const veryFarFuture = new Date();
        veryFarFuture.setFullYear(2147, 11, 31);
        CookieComponent.set('userToken',data.token,null);
        CookieComponent.set('permisos',data.permisos,{Expires: veryFarFuture});
        console.log(JSON.parse(CookieComponent.get('permisos')!));
        this.router.navigate(['/pruebas3']);
      },
      error: (data:any)=>{
        console.log(data)
        CookieComponent.delete('kt_app_sidebar_menu_scrollst');
        localStorage.removeItem('v8.2.3-authf649fc9a5f55');
        localStorage.removeItem('dark-sidebar-v8.2.3-layoutConfig');
        localStorage.removeItem('v8.2.3-baseLayoutType');
        this.router.navigate(['/']);
      }
    });
  }

}
