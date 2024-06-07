import { HttpHeaders } from "@angular/common/http";

// Funcion que exporta el options de las peticiones
export function getOptions(): any {
  return {
    headers : new HttpHeaders({
      'Accept': 'application/json',
      'Authorization' : 'Bearer '+ localStorage.getItem('userToken')!
    }),
    withCredentials : true
  }
}

export function getOptionsWithParams(params: any): any {
  return {
    headers : new HttpHeaders({
      'Accept': 'application/json',
      'Authorization' : 'Bearer '+ localStorage.getItem('userToken')!
    }),
    withCredentials : true,
    params : params
  }
}

export function getOptionsSimple(): any {
  return {
    headers : new HttpHeaders({
      'Accept': 'application/json',
    }),
    withCredentials : true
  }
}

export function  handleError(): void {
  localStorage.clear();
  // Redirigir a la página deseada
  //this.router.navigate(['/auth/login']);
  window.location.reload();
}