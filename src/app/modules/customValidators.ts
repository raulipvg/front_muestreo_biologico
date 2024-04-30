import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function booleanValidator(control: AbstractControl): ValidatorFn | ValidationErrors | null{
    if (control.value !== true && control.value !== false) {
        return { booleanValidator: { value: true } }; // Asignar un valor a la clave "booleanError"
      }
      return null; // Devuelve null si la validación pasa
}

export function rutValidator(control: AbstractControl): ValidationErrors | null {
  if(!control.value) return null;

  var digv = control.value.slice(-1);
  var rut = control.value.slice(0, control.value.length - 1);
  if (digv == 'K') digv = 'k';

  if(dv(rut) != digv)
    return { rutValidator :{ value: true}};

  return null; // RUT is valid
}

function dv(T:any) {
  var M = 0, S = 1;
  for (; T; T = Math.floor(T / 10))
      S = (S + T % 10 * (9 - M++ % 6)) % 11;
  return S ? S - 1 : 'k';
}