import { CanActivateFn, Router } from "@angular/router";
import { FormulariosService } from "./formularios.service";
import { inject } from "@angular/core";
import { CookieComponent } from "src/app/_metronic/kt/components";


export const registrarFormularioBiologico : CanActivateFn = (route:any, state:any) => {
  const formularioServicio = inject(FormulariosService);
  const router = inject(Router);
  const permi = JSON.parse(CookieComponent.get('permisosF')!).find((a:any)=>a.f_id==1).p5;
  if(!formularioServicio.formularioEnabled[0].enabled) router.navigate(['error/404']);
  return formularioServicio.formularioEnabled[0].enabled && permi;
}

export const vereditRespFormularioBiologico : CanActivateFn = (route:any, state:any) => {
  const permi = JSON.parse(CookieComponent.get('permisosF')!).find((a:any)=>a.f_id==1).p6;
  return permi;
}
