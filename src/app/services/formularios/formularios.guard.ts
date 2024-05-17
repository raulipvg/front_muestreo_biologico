import { CanActivateFn, Router } from "@angular/router";
import { FormulariosService } from "./formularios.service";
import { inject } from "@angular/core";
import { CookieComponent } from "src/app/_metronic/kt/components";


export const registrarFormularioBiologico : CanActivateFn = (route:any, state:any) => {
  const formularioServicio = inject(FormulariosService);
  const router = inject(Router);

//VERIFICACION DE EXISTENCIA DE LA COOKIE
  const permiso = validarPermisosFormularioBiologico();
  if(!permiso || !formularioServicio.formularioEnabled[0].enabled){
    router.navigate(['error/404']);
  } 
  return permiso.p5;
}

export const vereditRespFormularioBiologico : CanActivateFn = (route:any, state:any) => {
//VERIFICACION DE EXISTENCIA DE LA COOKIE
const permiso = validarPermisosFormularioBiologico();
  if(!permiso){
    const router = inject(Router);
    router.navigate(['error/404']);
  } 
  return permiso.p7;
}

export function privilegiosFormularioBiologico (p : number):boolean {
  //VERIFICACION DE EXISTENCIA DE LA COOKIE
  const permiso = validarPermisosFormularioBiologico();

  if(!permiso){
    const router = inject(Router);
    router.navigate(['error/404']);
  }
  if(p==5) return permiso.p5;
  else if(p==6) return permiso.p6;
  else return permiso.p7;

}


function validarPermisosFormularioBiologico(): boolean|any{
  const permisos = CookieComponent.get('permisosF'); 
  if(!permisos) return false;
  const permisosArray = JSON.parse(permisos);
  const permisoEncontrado = permisosArray.find(
                                      (a:any)=>a.f_id==1);
  if(!permisoEncontrado) return false;
  return permisoEncontrado;
}