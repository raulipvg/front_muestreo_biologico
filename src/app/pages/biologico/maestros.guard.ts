import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { CookieComponent } from "src/app/_metronic/kt/components";

export const verMaestrosBiologicos: CanActivateFn= (route:any, state:any) => {
    return JSON.parse(CookieComponent.get('permisosM')!).find((a:any)=>a.p_id==1).p1;
}

export function regMaestrosBiologicos () : boolean {
    return JSON.parse(CookieComponent.get('permisosM')!).find((a:any)=>a.p_id==1).p2;
}

export function editMaestrosBiologicos(): boolean {
    return JSON.parse(CookieComponent.get('permisosM')!).find((a:any)=>a.p_id==1).p3;
}

export function delMaestrosBiologicos(): boolean {
    return JSON.parse(CookieComponent.get('permisosM')!).find((a:any)=>a.p_id==1).p4;
}