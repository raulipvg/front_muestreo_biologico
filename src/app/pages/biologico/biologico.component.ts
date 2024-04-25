import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-biologico',
  standalone: true,
  imports: [
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './biologico.component.html',
  styleUrl: './biologico.component.scss'
})

export class BiologicoComponent implements OnInit{
  items = [
    { id: true, name: 'Habilitado' },
    { id: false, name: 'Deshabilitado' }
  ];

  especies =[  
    { id: 1, name: 'CABALLA' },
  ]

  naves = [
    { id: 1, name: 'ATACAMA IV' },
  ]

  plantas = [
    { id: 1, name: 'PESCA NORTE' },
  ]

  lugarms = [
    { id: 1, name: 'PONTON PLAYA BRAVA' },
  ]

  clasificaciones = [
    {
      id: 1, name: 'HARINA - ACEITE DE PESCADO'
    }
  ]

  flotas = [
    { id: 1, name: 'INDUSTRIAL' },
  ]

  puertos = [
    { id: 1, name: 'IQUIQUE' },
  ]

  departamentos = [
    { id: 1, name: 'ASEGURAMIENTO DE CALIDAD' },
  ]

  personas = [
    { id: 1, name: 'M. AGUILERA' },
  ]

  formulario: FormGroup;

  todayDate: string = new Date().toISOString().split('T')[0];
  // Calcular la fecha mínima (2 días atrás)
  minDate: string = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0];
  
  minDate2: string = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];

  // Definir la fecha máxima (hoy)
  maxDate: string = this.todayDate;

  constructor(
    private fb: FormBuilder,
  ) { };
  ngOnInit(): void {
    this.initValidacion();
  
  }
  initValidacion() {
    // Obtener la fecha actual

    this.formulario = this.fb.group({
      id: [''],
      especie: [,Validators.compose([
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(100) 
                  ])
                ],
      nave: [,Validators.compose([
                    Validators.required
                    
                  ])
                ],
      fecharecepcion: [,Validators.compose([
                    Validators.required,
                    this.fechaMin,
                    this.fechaMax              
                  ])
                ],
      planta: [,Validators.compose([
                    Validators.required
                  ])
                ],
      lugar: [,Validators.compose([
                    Validators.required
                  ])
                ],
      clasificacion : [1,Validators.compose([
                    Validators.required
                  ])
                ],
      hrspesca: [,Validators.compose([
                    Validators.required,
                    this.horaValidador()
                  ])
                ],
      flota: [,Validators.compose([
                    Validators.required
                  ])
                ],
      puerto: [1,Validators.compose([
                    Validators.required
                  ])
                ],
      departamento: [1,Validators.compose([
                    Validators.required
                  ])
                ],
      persona: [,Validators.compose([
                    Validators.required
                  ])
                ],
      fechaanalisis: [,Validators.compose([
                    Validators.required
                  ])
                ],
      horaanalisis: [,Validators.compose([
                  Validators.required
                ])
              ],
      pozoalmacenamiento: [,Validators.compose([
                    Validators.required
                  ])
                ],
      zona: [,Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(200)
                  ])
                ],
      capturaanunciada: [,Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(1000)
                  ])
                ],
      tratamientorsw: [,Validators.compose([
                    Validators.required
                  ])
                ],
       aguadescargada: [,Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(20000)
                  ])
                ],
      cuenta: [,Validators.compose([
                    Validators.required,
                    Validators.min(0),
                    Validators.max(100)
                  ])
                ],
      porcintegridad: [,Validators.compose([
                    Validators.required,
                    Validators.min(0),
                    Validators.max(100)
                  ])
                ],
      tvn: [,Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(100)
                  ])
                ],
      temperatura: [,Validators.compose([
                    Validators.required,
                    Validators.min(-10),
                    Validators.max(25)
                  ])
                ],
      ph: [,Validators.compose([
                    Validators.required,
                    Validators.min(5),
                    Validators.max(10)
                  ])
                ],
      grasa: [,Validators.compose([
                    Validators.required
                  ])
                ],
      // Crear un formulario de tipo array para las tallas
      analisis: this.fb.array([]),

      faunaacompanante: this.fb.array([])
       // Crear un formulario de tipo array para las tallas
      //pesos: this.fb.array([])   // Crear un formulario de tipo array para los pesos
                
    });
  }
  //GETTERS
  get f() { 
    return this.formulario.controls; 
  }
  get analisis() {
    return (this.formulario.controls['analisis'] as FormArray);
  }
  //ACCION DE AGREGAR FORMULARIO FAUNA
  get faunaacompanante(){
    return (this.formulario.controls['faunaacompanante'] as FormArray);
  }


  getFormControl(formArray:FormArray, i:number, nombre: string){
    let fg = formArray.controls[i] as FormGroup;
    return fg.controls[nombre];
  }
  
  //BTN::ACCION DE AGREGAR FORMULARIO ANALISIS 
  addAnalisis() {
    
    const nuevoAnalisis = this.fb.group({
      talla: ['', Validators.required],
      peso: ['', Validators.compose([
                    Validators.required,
                    Validators.min(0),
                    Validators.max(100)
                ])
            ]
    });

    this.analisis.push(nuevoAnalisis);
  }
  //BTN::ACCION DE ELIMINAR FORMULARIO ANALISIS
  deleteAnalisis(i: number) {
    this.analisis.removeAt(i);
  }

  //BTN::ACCION DE AGREGAR FORMULARIO FAUNA
  addFauna() {
    const nuevaFauna = this.fb.group({
      especie: ['', Validators.required],
      porcentaje: ['', Validators.compose([
                    Validators.required,
                    Validators.min(0),
                    Validators.max(50)
                ])
            ]
    });
    this.faunaacompanante.push(nuevaFauna); 
  }
  //BTN::ACCION DE ELIMINAR FORMULARIO FAUNA
  deleteFauna(i: number) {
    this.faunaacompanante.removeAt(i);
  }

  //BTN::ACCION DE GUARDAR FORMULARIO
  guardar() {
    console.log(this.formulario.value);
    this.formulario.markAllAsTouched();
    if(this.formulario.valid){
      console.log('Formulario Valido');
    }
  }
  //Validador de fecha mínima en Recepcion
  fechaMin(control: { value: string; }) {
    if(!control.value) return null;
    const partesFecha = control.value.split('-'); // Divide la cadena en partes
    const ano = parseInt(partesFecha[0]);
    const mes = parseInt(partesFecha[1]) - 1; // Restamos 1 porque los meses en JavaScript van de 0 a 11
    const dia = parseInt(partesFecha[2]);
  
    const fechaSeleccionada = new Date(ano, mes, dia);
    const dosDiasAtras = new Date();
    dosDiasAtras.setDate(dosDiasAtras.getDate() - 2);
    dosDiasAtras.setHours(0, 0, 0, 0)

    return (fechaSeleccionada < dosDiasAtras) ? { 'min': true } : null;

  }

  //Validador de fecha máxima en Recepcion
  fechaMax(control: { value: string; }) {
    if(!control.value) return null;
    const partesFecha = control.value.split('-'); // Divide la cadena en partes
    const ano = parseInt(partesFecha[0]);
    const mes = parseInt(partesFecha[1]) - 1; // Restamos 1 porque los meses en JavaScript van de 0 a 11
    const dia = parseInt(partesFecha[2]);
  
    const fechaSeleccionada = new Date(ano, mes, dia);
    const maxDate = new Date();
    maxDate.setHours(0, 0, 0, 0)
    return (fechaSeleccionada > maxDate) ? { 'max': true } : null;
  }

  //Validador de HH:MM en Data Pesca Hrs
  horaValidador(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const horaRegex = /^([0-9]|[1-9][0-9]|99):([0-5]?[0-9])$/; // Expresión regular para el formato HH:MM
      const valid = horaRegex.test(control.value);
      return valid ? null : { 'formato': { value: control.value } };
    };
  }
}
