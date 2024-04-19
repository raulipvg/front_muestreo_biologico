import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function booleanValidator(control: AbstractControl): ValidatorFn | ValidationErrors | null{
    if (control.value !== true && control.value !== false) {
        return { booleanValidator: { value: true } }; // Asignar un valor a la clave "booleanError"
      }
      return null; // Devuelve null si la validación pasa
}