import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IEspecieModel } from 'src/app/services/especies/especies.service';
import { INaveModel } from 'src/app/services/naves/naves.service';
import { IPlantaModel } from 'src/app/services/plantas/plantas.service';
import { FormulariosService } from 'src/app/services/formularios/formularios.service';
import { ILugarmModel } from 'src/app/services/lugaresm/lugaresm.service';
import { IClasificacionModel } from 'src/app/services/clasificaciones/clasificaciones.service';
import{ IPuertoModel } from 'src/app/services/puertos/puertos.service';
import { IDepartamentoModel } from 'src/app/services/departamentos/departamentos.service';
import { IPersonaModel } from 'src/app/services/personas/personas.service';
import { RespuestasService } from 'src/app/services/respuestas/respuestas.service';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-biologico',
  standalone: true,
  imports: [
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SweetAlert2Module,
  ],
  templateUrl: './biologico.component.html',
  styleUrl: './biologico.component.scss'
})

export class BiologicoComponent implements OnInit{
  
  items = [
    { id: true, name: 'Habilitado' },
    { id: false, name: 'Deshabilitado' }
  ];


  especies : IEspecieModel[] = [];
  naves : INaveModel[] = [];
  plantas : IPlantaModel[] = [];
  lugarms: ILugarmModel[] = [];
  clasificaciones : IClasificacionModel[] = [];
  flotas: ILugarmModel[] = [];
  puertos: IPuertoModel[] = [];
  departamentos: IDepartamentoModel[] = [];
  personas: IPersonaModel[] = [];

  especiesObjetivos: IEspecieModel[] = [];
  especiesAcompanantes: IEspecieModel[] = [];
  formulario: FormGroup;

  todayDate: string = new Date().toISOString().split('T')[0];
  // Calcular la fecha mínima (2 días atrás)
  minDate: string = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0];
  minDate2: string = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
  // Definir la fecha máxima (hoy)
  maxDate: string = this.todayDate;
  previousSelectedFaunaId: number[] = [];

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  flag: boolean = false;
  constructor(
    private fb: FormBuilder,
    private formularioService: FormulariosService,
    private respuestasService: RespuestasService,
    private cdRef: ChangeDetectorRef,
  ) { };
  ngOnInit(): void {

    this.initValidacion();
    
    this.formularioService
          .getselects()
          .subscribe((data: any) => {
              this.especies = data.especies;
              this.naves = data.naves;
              this.plantas = data.plantas;
              this.lugarms = data.lugarms;
              this.clasificaciones = data.clasificaciones;
              this.formulario.get('clasificacion_id')?.setValue(1);
              this.flotas = data.flotas;
              this.puertos = data.puertos;
              this.formulario.get('puerto_id')?.setValue(1);
              this.departamentos = data.departamentos;
              this.formulario.get('departamento_id')?.setValue(1);
              this.personas = data.personas;
          });
  }

  ngAfterViewInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

  initValidacion() {
    // Obtener la fecha actual
    this.formulario = this.fb.group({
      id: [''],
      formulario_id: [1],
      especieobjetivo_id: [,Validators.compose([
                    Validators.required
                  ])
                ],
      nave_id: [,Validators.compose([
                    Validators.required
                    
                  ])
                ],
      fecha_recepcion: [,Validators.compose([
                    Validators.required,
                    this.fechaMin,
                    this.fechaMax              
                  ])
                ],
      planta_id: [,Validators.compose([
                    Validators.required
                  ])
                ],
      lugar_id: [,Validators.compose([
                    Validators.required
                  ])
                ],
      clasificacion_id : [,Validators.compose([
                    Validators.required
                  ])
                ],
      hrs_pesca: [,Validators.compose([
                    Validators.required,
                    this.horaValidador()
                  ])
                ],
      flota_id: [,Validators.compose([
                    Validators.required
                  ])
                ],
      puerto_id: [,Validators.compose([
                    Validators.required
                  ])
                ],
      departamento_id: [,Validators.compose([
                    Validators.required
                  ])
                ],
      persona_id: [,Validators.compose([
                    Validators.required
                  ])
                ],
      fecha_analisis: [,Validators.compose([
                    Validators.required
                  ])
                ],
      hora_analisis: [,Validators.compose([
                  Validators.required
                ])
              ],
      pozo_almacenamiento: [,Validators.compose([
                    Validators.required
                  ])
                ],
      zona: [,Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(200)
                  ])
                ],
      captura_anunciada: [,Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(1000)
                  ])
                ],
      tratamientorsw: [,Validators.compose([
                    Validators.required
                  ])
                ],
       agua_descargada: [,Validators.compose([
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
      tvn: [,Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(100)
                  ])
                ],
      temperatura: [,Validators.compose([
                    Validators.required,
                    Validators.min(4),
                    Validators.max(20)
                  ])
                ],
      ph: [,Validators.compose([
                    Validators.required,
                    Validators.min(5),
                    Validators.max(10)
                  ])
                ],
      grasa: [,Validators.compose([
                    Validators.min(0),
                    Validators.max(100)
                  ])
                ],
      calidad_aceite: [,Validators.compose([
                    Validators.min(0),
                    Validators.max(100)
                  ])
                ],
      // Crear un formulario de tipo array para las tallas
      analisis: this.fb.array([]),

      fauna_acompanante: this.fb.array([])
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
  get fauna_acompanante(){
    return (this.formulario.controls['fauna_acompanante'] as FormArray);
  }


  getFormControl(formArray:FormArray, i:number, nombre: string){
    let fg = formArray.controls[i] as FormGroup;
    return fg.controls[nombre];
  }

  getMinValue(index: number, nombre: string): number {
    const control = this.getFormControl(this.analisis, index, nombre);
  //const minValidator = control && control.validator ? control.validator({} as AbstractControl)?.min : null;
    const minValidator = control?.errors?.min;  
  return minValidator ? minValidator.min : 0;
  }

  getMaxValue(index: number, nombre: string): number {
    const control = this.getFormControl(this.analisis, index, nombre);
  //const minValidator = control && control.validator ? control.validator({} as AbstractControl)?.min : null;
    const maxValidator = control?.errors?.max;  
  return maxValidator ? maxValidator.max : 100;
  }


  //BTN::ACCION DE AGREGAR FORMULARIO ANALISIS 
  addAnalisis() {
    
    const nuevoAnalisis = this.fb.group({
      especie_id: [, Validators.compose([
                    Validators.required
                  ])
                ],
      talla: [, Validators.compose([
                  Validators.required,
                  Validators.min(1),
                  Validators.max(200)
                ])
              ],
      peso: [, Validators.compose([
                  Validators.required,
                  Validators.min(1),
                  Validators.max(700)
                ])
            ],
      integridad: [, Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(100)
                  ])
                ],
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
      especie_id: ['', Validators.required],
      porcentaje: ['', Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(50),
                    this.porcentajeValidador()
                ])
            ]
    });
    //this.previousSelectedFaunaId = 0;
    this.fauna_acompanante.push(nuevaFauna); 
  }
  //BTN::ACCION DE ELIMINAR FORMULARIO FAUNA
  deleteFauna(i: number) {
    //Eliminacion de un elemento del FormArray
    
    if(this.previousSelectedFaunaId[i] ) {
      var index = this.especiesAcompanantes.findIndex(especie => especie.id === this.previousSelectedFaunaId[i]);
      this.especiesAcompanantes[index].flag = !this.especiesAcompanantes[index].flag;
    }
    this.previousSelectedFaunaId.splice(i, 1);
    this.fauna_acompanante.removeAt(i);
  }

  selectEspecieObjetivo( $event: any) {
    //console.log($event);
    //SETEA LAS ESPECIES OBJETIVOS Y ACOMPAÑANTES SEGUN LA ESPECIE SELECCIONADA

    this.especiesObjetivos = this.especies
                                  .filter(
                                    especie => $event.includes(especie.id)
                                  );
    this.especiesAcompanantes = this.especies
                                  .filter(
                                    especie => !$event.includes(especie.id)
                                  )
                                  .map(especie => ({ ...especie, flag: false }));
  }

  selectEspecieAnalisis( $event: any, i:any) {
    //console.log($event + ' i:' + i);
   //SETEA LOS VALIDADORES DE TALLA Y PESO SEGUN LA ESPECIE SELECCIONADA

    const especieEncontrada= this.especiesObjetivos.find(especie => especie.id === $event);
    const talla_min = especieEncontrada?.talla_min || 1;
    const talla_max = especieEncontrada?.talla_max || 200;
    const peso_min = especieEncontrada?.peso_min || 1;
    const peso_max = especieEncontrada?.peso_max || 700;

    const tallaControl = (this.analisis.at(i) as FormGroup).get('talla');
    const pesoControl = (this.analisis.at(i) as FormGroup).get('peso');

    const nuevoValidadoresTall = [
        Validators.required,
        Validators.min(talla_min), 
        Validators.max(talla_max)
    ];
    const nuevoValidadoresTalla = [
        Validators.required,
        Validators.min(peso_min), 
        Validators.max(peso_max)
    ];
  // Aplica los nuevos validadores al control 'talla'
  tallaControl?.setValidators(nuevoValidadoresTall);
  pesoControl?.setValidators(nuevoValidadoresTalla);
  // Actualiza el estado de validación del control 'talla'
  tallaControl?.updateValueAndValidity();
  pesoControl?.updateValueAndValidity();
  }

  selectEspecieFauna( $event: any, i:any) {

      //console.log($event + ' i:' + i+ ' previus:' + this.previousSelectedFaunaId[i]);
      var index = this.especiesAcompanantes.findIndex(especie => especie.id === $event);
      if(index === -1) {console.log('No se encontro la especie');return;}     
      this.especiesAcompanantes[index].flag = !this.especiesAcompanantes[index].flag;
      
      if(this.previousSelectedFaunaId[i] && this.previousSelectedFaunaId[i] !== $event) {
        var index = this.especiesAcompanantes.findIndex(especie => especie.id === this.previousSelectedFaunaId[i]);
        this.especiesAcompanantes[index].flag = !this.especiesAcompanantes[index].flag;
      }
      this.previousSelectedFaunaId[i] = $event;

  }
  //BTN::ACCION DE GUARDAR FORMULARIO
  guardar() {
    console.log(this.formulario.value);
    this.formulario.markAllAsTouched();
    if(this.formulario.valid){
      console.log('Formulario Valido');

      const successAlert: SweetAlertOptions = {
        icon: 'success',
        title: 'Exito',
        text: 'Formulario Ingresado'
      };
      const errorAlert: SweetAlertOptions = {
        icon: 'error',
        title: 'Error!',
        text: '',
      };

      this.respuestasService
            .create(this.formulario.value)
            .subscribe({
              next: (data: any) => {
                this.showAlert(successAlert);
                this.flag =true;    
              },
              error: (error: any) => {
                this.showAlert(errorAlert);
                this.flag = false;
              }
              });
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

  //Validador de porcentaje en Fauna Acompañante
  porcentajeValidador(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      //const porcentaje = control.value;
      const totalPorcentaje = this.fauna_acompanante.controls
                                    .map((fg: any) => fg.get('porcentaje')?.value || 0)
                                    .reduce((acc, curr) => acc + curr, 0);
      //console.log('Total Porcentaje: ' + totalPorcentaje);                            
      return (totalPorcentaje  > 50) ? { 'fauna': { value: control.value } } : null;
    };
  }

  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign({
      buttonsStyling: false,
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "btn btn-" + style
      }
    }, swalOptions);

    this.cdRef.detectChanges();
    this.noticeSwal.fire();
  }

  reload() {
    if(this.flag) {
      this.formulario.reset();
      this.initValidacion();
      this.flag = false;
    }
  }
}
