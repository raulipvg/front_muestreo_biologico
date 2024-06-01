import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";

export const verMaestroFormulario: CanActivateFn= (route:any, state:any) => {
    const permisos = validarPermisosMaestroFormulario();
    if(!permisos || !permisos.p1){
        const router = inject(Router);
        return router.createUrlTree(['error/404']);
    } 
    return permisos.p1;
}

export function privilegiosMaestroFormulario(p: number): boolean {
    const permisos = validarPermisosMaestroFormulario();
    if(!permisos){
        const router = inject(Router);
        router.createUrlTree(['error/404']);
    } 
    if(p==1) return permisos.p1;
    else if(p==2) return permisos.p2;
    else if(p==3) return permisos.p3;
    else return permisos.p4;
}

function validarPermisosMaestroFormulario(): boolean|any{
    const permisos = localStorage.getItem('permisosM');
    if(!permisos) return false;
    const permisosArray = JSON.parse(permisos);
    const permisoEncontrado = permisosArray.find((a:any)=>a.p_id==2);
    if(!permisoEncontrado) return false;
    return permisoEncontrado;
}