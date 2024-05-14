import { CanActivateFn, Router } from "@angular/router";
import { FormulariosService } from "./formularios.service";
import { inject } from "@angular/core";
import { map, take, tap } from "rxjs";


export const formularioBiologico : CanActivateFn = (route:any, state:any) => {
  const formularioServicio = inject(FormulariosService);
  const router = inject(Router);
  if(!formularioServicio.formularioEnabled[0].enabled) router.navigate(['error/404']);
  return formularioServicio.formularioEnabled[0].enabled;
}