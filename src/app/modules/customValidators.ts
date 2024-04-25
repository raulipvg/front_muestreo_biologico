import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function booleanValidator(control: AbstractControl): ValidatorFn | ValidationErrors | null{
    if (control.value !== true && control.value !== false) {
        return { booleanValidator: { value: true } }; // Asignar un valor a la clave "booleanError"
      }
      return null; // Devuelve null si la validación pasa
}

export function rutValidator(control: AbstractControl): ValidationErrors | null {
  const rut = control.value;

  // Check if RUT is empty
  if (!rut) {
    return null; // Return null if empty (doesn't trigger validation error)
  }

  // Remove spaces and dashes from RUT
  const cleanRut = rut.replace(/[^0-9-]+/g, '');

  // Validate RUT format (length and structure)
  if (cleanRut.length !== 10 || !/^[0-9\-]+$/.test(cleanRut)) {
    return { invalidRutFormat: true };
  }

  // Extract RUT components
  const rutNumber = parseInt(cleanRut.slice(0, -1));
  const verifierDigit = cleanRut.charAt(cleanRut.length - 1);

  // Calculate verification digit
  const calculatedDV = calculateDV(rutNumber);

  // Check if verification digit matches calculated digit
  if (verifierDigit.toLowerCase() !== calculatedDV.toString()) {
    return { invalidRutVerification: true };
  }

  return null; // RUT is valid
}

// Function to calculate the verification digit
function calculateDV(rutNumber: number): number {
  let multiplier = 2;
    let sum = 0;

    for (let i = rutNumber.toString().length - 1; i >= 0; i--) {
      const digit = parseInt(rutNumber.toString().charAt(i));
      sum += digit * multiplier;
      multiplier = multiplier % 11 === 0 ? 1 : multiplier + 1;
    }

    const residual = sum % 11;
    return residual === 1 ? 0 : 11 - residual;
}