import { CanActivateFn, Router } from "@angular/router";
import { FormulariosService } from "./formularios.service";
import { inject } from "@angular/core";


export const registrarFormularioBiologico : CanActivateFn = (route:any, state:any) => {
  const formularioServicio = inject(FormulariosService);
  const router = inject(Router);

//VERIFICACION DE EXISTENCIA DE LA COOKIE
  const permiso = validarPermisosFormularioBiologico();
  if(!permiso || !permiso.p6 || !formularioServicio.formularioEnabled[0].enabled){
    return router.createUrlTree(['error/404']);
  } 
  return permiso.p6;
}

export const editRespFormularioBiologico : CanActivateFn = (route:any, state:any) => {
//VERIFICACION DE EXISTENCIA DE LA COOKIE
const permiso = validarPermisosFormularioBiologico();
  if(!permiso || !permiso.p7){
    const router = inject(Router);
    return router.createUrlTree(['error/404']);
  } 
  return permiso.p7;
}

export function privilegiosFormularioBiologico (p : number):boolean {
  //VERIFICACION DE EXISTENCIA DE LA COOKIE
  const permiso = validarPermisosFormularioBiologico();

  if(!permiso){
    const router = inject(Router);
    router.createUrlTree(['error/404']);
  }
  if(p==6) return permiso.p6;
  else if(p==7) return permiso.p7;
  else return permiso.p8;

}


function validarPermisosFormularioBiologico(): boolean|any{
  const permisos = localStorage.getItem('permisosF'); 
  if(!permisos) return false;
  const permisosArray = JSON.parse(permisos);
  const permisoEncontrado = permisosArray.find(
                                      (a:any)=>a.f_id==1);
  if(!permisoEncontrado) return false;
  return permisoEncontrado;
}