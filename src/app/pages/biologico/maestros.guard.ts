import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { CookieComponent } from "src/app/_metronic/kt/components";

export const verMaestrosBiologicos: CanActivateFn= (route:any, state:any) => {
    const permisos = validarPermisosMaestrosBiologicos();
    if(!permisos){
        const router = inject(Router);
        router.navigate(['error/404']);
    } 
    return permisos.p1;
}

export function regMaestrosBiologicos () : boolean {
    const permisos = validarPermisosMaestrosBiologicos();
    if(!permisos){
        const router = inject(Router);
        router.navigate(['error/404']);
    } 
    return permisos.p2;
}

export function editMaestrosBiologicos(): boolean {
    const permisos = validarPermisosMaestrosBiologicos();
    if(!permisos) {
        const router = inject(Router);
        router.navigate(['error/404']);
    }
    return permisos.p3;
}

export function delMaestrosBiologicos(): boolean {
    const permisos = validarPermisosMaestrosBiologicos();
    if(!permisos){
        const router = inject(Router);
        router.navigate(['error/404']);
    } 
    return permisos.p4;
}

function validarPermisosMaestrosBiologicos(): boolean|any{
    const permisos = CookieComponent.get('permisosM');
    if(!permisos) return false;
    const permisosArray = JSON.parse(permisos);
    const permisoEncontrado = permisosArray.find((a:any)=>a.p_id==1);
    if(!permisoEncontrado) return false;
    return permisoEncontrado;
}