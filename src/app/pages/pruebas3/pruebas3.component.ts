import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { languageConfig } from '../../../assets/sass/core/base/datatables/language_es';
import { UsersService } from '../../services/users/users.service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import { ModalRegistrarComponent } from './modalregistrar/modalregistrar.component'
import { EspeciesComponent } from '../maestros/especies/especies.component';
import { NavesComponent } from '../maestros/naves/naves.component';
import { PlantasComponent } from '../maestros/plantas/plantas.component';
import { LugaresmComponent } from '../maestros/lugaresm/lugaresm.component';
import { ClasificacionesComponent } from '../maestros/clasificaciones/clasificaciones.component';
import { FlotasComponent } from '../maestros/flotas/flotas.component';
import { PuertosComponent } from '../maestros/puertos/puertos.component';
import { DepartamentosComponent } from '../maestros/departamentos/departamentos.component';
import { PersonasComponent } from '../maestros/personas/personas.component';
import { FormulariosComponent } from '../maestros/formularios/formularios.component';
import { LoginService } from 'src/app/services/login/login.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { env } from 'src/environments/env';
import { CookieComponent } from 'src/app/_metronic/kt/components';
import { Router } from '@angular/router';


const headers = new HttpHeaders({
  'ngrok-skip-browser-warning': 'any-value',
  'Accept': 'application/json'
});
const options = {
  headers,
  withCredentials : true,
  withXsrfConfiguration : true
}

@Component({
  selector: 'app-pruebas3',
  standalone: true,
  imports: [
    CommonModule,
    DataTablesModule,
    HttpClientModule, 
    NgbTooltip, 
    ModalRegistrarComponent,
    EspeciesComponent,
    NavesComponent,
    PlantasComponent,
    LugaresmComponent,
    ClasificacionesComponent,
    FlotasComponent,
    PuertosComponent,
    DepartamentosComponent,
    PersonasComponent,
    FormulariosComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './pruebas3.component.html',
  styleUrl: './pruebas3.component.scss'
})
export class Pruebas3Component implements OnInit{
  googleRedirectURL = env.GOOGLE_REDIRECT_URL;
  formulario : FormGroup;
  constructor( 
    private servicio : LoginService,
    private fb : FormBuilder,
    private router : Router
  ){}

  ngOnInit(){
    this.creaFormBuilder();
  }

  creaFormBuilder(){
    this.formulario = this.fb.group({
      username : [, Validators.required],
      password: [, Validators.required]
    })
  }

  submit(){
    this.servicio.normal(this.formulario.value).subscribe({
      next: (data : any) => {
        console.log(data);
        const veryFarFuture = new Date();
        veryFarFuture.setFullYear(2147, 11, 31);
        CookieComponent.set('userToken',data.token, {Expires: veryFarFuture});
        CookieComponent.set('permisosF',data.permisosF,{Expires: veryFarFuture});
        CookieComponent.set('permisosM',data.permisosM,{Expires: veryFarFuture});
      },
      error: (data:any) => {
        CookieComponent.delete('login-in');
      }
    });
  }

  logout(){
    this.servicio.logout(CookieComponent.get('userToken')).subscribe((data)=>{
      CookieComponent.delete('userToken');
      CookieComponent.delete('permisosF');
      CookieComponent.delete('permisosM');
      CookieComponent.delete('kt_app_sidebar_menu_scrollst');
      localStorage.removeItem('v8.2.3-authf649fc9a5f55');
      localStorage.removeItem('dark-sidebar-v8.2.3-layoutConfig');
      localStorage.removeItem('v8.2.3-baseLayoutType');
      this.router.navigate(['auth/login'], {
        queryParams: {},
      });
    });
  }

  loginGoogle() {
    window.location.href = env.GOOGLE_REDIRECT_URL;
  }
}
