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
import { PageLoadingComponent } from 'src/app/modules/page-loading/page-loading.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-biologico',
  standalone: true,
  imports: [
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SweetAlert2Module,
    PageLoadingComponent
  ],
  templateUrl: './biologico.component.html',
  styleUrl: './biologico.component.scss'
})

export class BiologicoComponent implements OnInit{
  
  items = [
    { id: true, name: 'Habilitado' },
    { id: false, name: 'Deshabilitado' }
  ];


  
  naves : INaveModel[] = [];
  plantas : IPlantaModel[] = [];
  lugarms: ILugarmModel[] = [];
  clasificaciones : IClasificacionModel[] = [];
  flotas: ILugarmModel[] = [];
  puertos: IPuertoModel[] = [];
  departamentos: IDepartamentoModel[] = [];
  personas: IPersonaModel[] = [];

  especies : IEspecieModel[] = [];
  especiesAcompanantesTotales: IEspecieModel[] = [];
  especiesObjetivos: IEspecieModel[] = [];
  especiesAcompanantes: IEspecieModel[] = [];
  previousSelectedFaunaId: number[] = [];

  formulario: FormGroup;

  todayDate: string = new Date().toISOString().split('T')[0];
  // Calcular la fecha mínima (2 días atrás)
  minDate: string = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0];
  minDateAnalisis: string = new Date(new Date().setDate(new Date().getDate())).toISOString().split('T')[0];
  // Definir la fecha máxima (hoy)
  maxDate: string = this.todayDate;
  maxDateAnalisis: string = new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0];
 

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  @ViewChild('loading') loading: PageLoadingComponent;

  flag: boolean = false;
  integridadTotalFlag: boolean = false;
  integridadTotalValue: any = null;

  id: number | null;
  nombreSubmit: string = 'Guardar';
  constructor(
    private fb: FormBuilder,
    private formularioService: FormulariosService,
    private respuestasService: RespuestasService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) { };

  ngOnInit(): void {

    this.initValidacion();
    this.id = Number(this.route.snapshot.paramMap.get('id')); //EDICION DE FORMULARIO
   
  }
  selectedFileName: string = '';
  ngAfterViewInit(): void {

    this.loadingEvent();
    this.formularioService
          .getselects()
          .subscribe({
            next: (data: any) => {
              this.especies = data.especies.filter(
                                  (especie: { tipo1: number; }) => especie.tipo1 <3
                                  );
              this.especiesAcompanantesTotales = data.especies.filter(
                                              (especie: { tipo1: number; }) => especie.tipo1 >1
                                              );
              //this.especiesAcompanantes = this.especiesAcompanantesTotales;
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
            },
            error: (error: any) => {
              //console.log('Error al cargar los selectores');
              const errorAlert: SweetAlertOptions = {
                icon: 'error',
                title: 'Error!',
                text: '',
              };
              this.showAlert(errorAlert);
            }
          })
          .add(() => {
            if(!this.id){this.loadingEvent()};
          });

    //INICIO::SI ES UNA EDICION
    if(this.id){
      //this.loadingEvent();
      this.nombreSubmit = 'Actualizar';
      this.respuestasService.get(this.id).subscribe({
        next: (data: any) => {
          //console.log(data);
          //asignar valores en data a los campos del formulario
        
          this.formulario.patchValue(data.json);
          this.formulario.get('id')?.setValue(data.id);
          
          this.especiesObjetivos = this.especies.filter(
                                      especie => data.json.especieobjetivo_id.includes(especie.id)
                                    );
          
          data.json.analisis.forEach((data: any) => {
            this.addAnalisis(data.especie_id);
            this.analisis.controls[this.analisis.length - 1].patchValue(data);
          });

          this.especiesAcompanantes = this.especiesAcompanantesTotales.filter(
            especie => !data.json.especieobjetivo_id.includes(especie.id)
          );
          data.json.fauna_acompanante.forEach((data: any) => {
            this.addFauna();
            this.fauna_acompanante.controls[this.fauna_acompanante.length - 1].patchValue(data);
          });

        if(data.resp_storage.length > 0){
          this.selectedFileName=data.resp_storage[data.resp_storage.length-1]?.nombre;
          //Quitar el validador de imagen requerido si ya existe una imagen
          this.formulario.get('imagen')?.clearValidators();
          this.formulario.get('imagen')?.updateValueAndValidity(); 
        }
          
        },
        error: (error: any) => {
          //console.log(error.error);
        }
      })
      .add(() => {
        this.loadingEvent();
      });
    }
    //FIN::SI ES UNA EDICION
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
                    this.fechaMinRecepcion,
                    this.fechaMaxRecepcion              
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
      pozo_almacenamiento: [,Validators.compose([
                    Validators.required
                  ])
                ],
      zona: [,Validators.compose([
                    Validators.required,
                    Validators.min(101),
                    Validators.max(159)
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
                    Validators.max(2000)
                  ])
                ],
      cuenta: [,Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(500)
                  ])
                ],
      tvn: [,Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(300)
                  ])
                ],
      temperatura: [,Validators.compose([
                    Validators.required,
                    Validators.min(0),
                    Validators.max(30)
                  ])
                ],
      ph: [,Validators.compose([
                    Validators.required,
                    Validators.min(0),
                    Validators.max(14)
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
      imagen: [,Validators.compose([
                    Validators.required
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

  flagAnalisisBtn: boolean = false;
  //BTN::ACCION DE AGREGAR FORMULARIO ANALISIS 
  addAnalisis(id?: any) {
    //VALUES
    let especie_id: number |null;
    //VALIDATORS
    let talla_min: number;
    let talla_max: number;
    let peso_min: number;
    let peso_max: number;

    if(id){
      especie_id = id;
      const especieEncontrada= this.especiesObjetivos.find(especie => especie.id === id);
      talla_min = especieEncontrada?.talla_min || 1;
      talla_max = especieEncontrada?.talla_max || 200;
      peso_min = especieEncontrada?.peso_min || 1;
      peso_max = especieEncontrada?.peso_max || 700;
    }else{   
      especie_id = this.especiesObjetivos[0]?.id || null;     
      talla_min = this.especiesObjetivos[0]?.talla_min || 1;
      talla_max = this.especiesObjetivos[0]?.talla_max || 200;
      peso_min = this.especiesObjetivos[0]?.peso_min || 1;
      peso_max = this.especiesObjetivos[0]?.peso_max || 700;
    } 
    
      
    const nuevoAnalisis = this.fb.group({
      
      especie_id: [especie_id, Validators.compose([
                    Validators.required
                  ])
                ],
      talla: [, Validators.compose([
                  Validators.required,
                  Validators.min(talla_min),
                  Validators.max(talla_max)
                ])
              ],
      peso: [, Validators.compose([
                  Validators.required,
                  Validators.min(peso_min),
                  Validators.max(peso_max)
                ])
            ],
      integridad: [{ 
                    value: this.integridadTotalValue??null,
                    disabled: this.integridadTotalFlag
                  },Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(100)
                  ])
                ],
    });

    this.analisis.push(nuevoAnalisis);
    //this.analisis.get('especie_id')?.setValue(3);
    if(this.analisis.length > 0) {
        this.flagAnalisisBtn = true;
    }
  }

  //BTN::ACCION DE ELIMINAR FORMULARIO ANALISIS
  deleteAnalisis(i: number) {
    this.analisis.removeAt(i);
    if(this.analisis.length === 0) {
      this.flagAnalisisBtn = false;
    }
  }

  flagFaunaBtn: boolean = false;
  //BTN::ACCION DE AGREGAR FORMULARIO FAUNA
  addFauna() {
    const nuevaFauna = this.fb.group({
      especie_id: ['', Validators.required],
      porcentaje: ['', Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(99),
                    this.porcentajeValidador()
                ])
            ]
    });
    //this.previousSelectedFaunaId = 0;
    this.fauna_acompanante.push(nuevaFauna);
    if(this.fauna_acompanante.length > 0) {
      this.flagFaunaBtn = true;
    } 
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
    if(this.fauna_acompanante.length === 0) {
      this.flagFaunaBtn = false;
    }
  }
  selectNave( $event: any) {
    console.log($event);
    //SETEA LA FLOTA SEGUN LA NAVE SELECCIONADA
    const naveEncontrada = this.naves.find(nave => nave.id === $event);
    this.formulario.get('flota_id')?.setValue(naveEncontrada?.flota_id);
  }
  selectEspecieObjetivo( $event: any) {
    //console.log($event);
    //SETEA LAS ESPECIES OBJETIVOS Y ACOMPAÑANTES SEGUN LA ESPECIE SELECCIONADA

    this.especiesObjetivos = this.especies
                                  .filter(
                                    especie => $event.includes(especie.id)
                                  );
    //Todas las especies acompañantes a excepcion de las especies objetivos
    this.especiesAcompanantes = this.especiesAcompanantesTotales
                                    .filter(
                                      especie => !$event.includes(especie.id)
                                    );
    
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

  selectEspecieAnalasisRemove( $event: any) {
    console.log($event);
    const  $id = $event;
    this.analisis.controls.forEach((fg: any, i: any) => { 
      const especieId = fg.get('especie_id')?.value;
      if(especieId === $id){
        fg.get('especie_id')?.setValue(null);
      }      
    });
  }
  selectEspecieAnalisisClear(){
    this.analisis.controls.forEach((fg: any, i: any) => { 
      fg.get('especie_id')?.setValue(null);
    });
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

  //EVENTTO DEL SWITCH QUE DETERMINA LA INTEGRIDAD TOTAL O PARCIAL
  onSwitchIntegridadTotal(event: any) {
    const isChecked = event.target.checked;
    if(isChecked){
      this.integridadTotalFlag = true;

      //Agregar un nuevo form control al formulario llamado intregridadTotal
      this.formulario.addControl('integridadtotal', 
                                    this.fb.control(null, 
                                      Validators.compose([
                                        Validators.required,
                                        Validators.min(1),
                                        Validators.max(100)
                                      ])
                                  ));
      //console.log('Integridad Total');
    }else{
      this.integridadTotalFlag = false;
      this.integridadTotalValue = null;
      this.formulario.removeControl('integridadtotal');
      this.analisis.controls.forEach((fg: any, i: any) => { 
        fg.get('integridad')?.setValue(null);
        fg.get('integridad')?.enable();
      });
      //console.log('Integridad Parcial');
    }
  }
  //EVENTO QUE CAPTURA EL VALOR DE INTEGRIDAD TOTAL
  onIntegridadTotal(event: any) {
    //console.log(event.target.value);
    this.integridadTotalValue = event.target.value;
    this.analisis.controls.forEach((fg: any, i: any) => { 
      fg.get('integridad')?.setValue(event.target.value);
      fg.get('integridad')?.disable();
    });
  }
  formData = new FormData();
  //EVENTO QUE CAPTURA LA IMAGEN
  onFileChange(event: any) {
    const file = event.target.files[0];

    this.formData = new FormData();
    this.formData.append("imagen", file);
    
    //ths.formulario.patchValue({ imagen: file });
  }
  //BTN::ACCION DE GUARDAR FORMULARIO
  guardar() {
    //console.log(this.formulario.value);
    this.formulario.markAllAsTouched();
    if(this.formulario.valid){
      //console.log('Formulario Valido');

      if(this.integridadTotalFlag){
        this.analisis.controls.forEach((fg: any, i: any) => { 
          fg.get('integridad')?.enable();
        });
        this.formulario.get('integridadtotal')?.disable();
      }

      const successAlert: SweetAlertOptions = {
        icon: 'success',
        title: 'Exito',
        text: this.id?'Formulario Actualizado':'Formulario Ingresado'
      };
      const errorAlert: SweetAlertOptions = {
        icon: 'error',
        title: 'Error!',
        text: this.id?'Error al actualizar el formulario':'Error al ingresar el formulario',
      };
      this.loadingEvent();
      
      //SI ES UNA EDICION
      if(this.id){
        this.respuestasService
              .update(this.formulario.value,this.formData)
              .subscribe({
                next: (data: any) => {
                  this.showAlert(successAlert);
                  this.flag = true;
                },
                error: (error: any) => {
                  this.showAlert(errorAlert);
                  this.flag = false;
                }
              })
              .add(() => {
                this.loadingEvent();
              });

      }else{ //SI ES UN NUEVO FORMULARIO
        this.respuestasService
              .create(this.formulario.value,this.formData)
              .subscribe({
                next: (data: any) => {           
                  //this.formData.append("respuesta_id", data.id);
                  //this.respuestasService.upload(this.formData).subscribe();
                  this.showAlert(successAlert);
                  this.flag =true;    
                },
                error: (error: any) => {
                  this.showAlert(errorAlert);
                  this.flag = false;
                }
                })
                .add(() => {
                  this.loadingEvent();
                });
        }
    }
  }
  //Validador de fecha mínima en Recepcion
  fechaMinRecepcion(control: { value: string; }) {
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
  fechaMaxRecepcion(control: { value: string; }) {
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

 

 //Validador de fecha en Analisis mayor a Recepcion
  fechaAnalisisMayoraRecepcion(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if(!control.value) return null;     
      const fechaSeleccionada = this.fechaParser(control.value);
      const fecha = this.formulario.get('fecha_recepcion')?.value;
      let fechaRecepcion: Date;
      if(fecha){
        fechaRecepcion = this.fechaParser(fecha);
      }else{
        fechaRecepcion = new Date();
        fechaRecepcion.setHours(0, 0, 0, 0);
      }
      
      return (fechaSeleccionada < fechaRecepcion) ? { 'mayor_a': true } : null;
    };
  }

  fechaParser(fecha: string): Date {
    const partesFecha = fecha.split('-'); // Divide la cadena en partes
    const ano = parseInt(partesFecha[0]);
    const mes = parseInt(partesFecha[1]) - 1; // Restamos 1 porque los meses en JavaScript van de 0 a 11
    const dia = parseInt(partesFecha[2]);
    return new Date(ano, mes, dia);
  }

  //Validador de HH:MM en Data Pesca Hrs
  horaValidador(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const horaRegex = /^(0[1-9]|[1-9][0-9]|1[0-6][0-8]):([0-5]?[0-9])$/; // Expresión regular para el formato HH:MM, acepta desde 01:00 hasta 168:59
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
      return (totalPorcentaje  > 99) ? { 'fauna': { value: control.value } } : null;
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
    //SI GUARDA O EDITA EL FORMULARIO DE FORMA EXITOSA SE REINICIA EL FORMULARIO
    if(this.flag) {
      //SI ES UNA EDICION
      if(this.id){
        this.router.navigate(['/biologico']);
      //SI ES UN GUARDAR
      }else{
      this.integridadTotalFlag = false;
      this.integridadTotalValue = null;
      this.flag = false;
      this.flagAnalisisBtn = false;
      this.flagFaunaBtn = false;
      this.especiesObjetivos = [];
      this.especiesAcompanantes = [];
      this.previousSelectedFaunaId = [];
      for (const especie of this.especiesAcompanantesTotales) {
        delete especie.flag;
      }
      //this.formulario.removeControl('integridadtotal');
      //this.formulario.reset();
      this.initValidacion();
      this.formulario.get('clasificacion_id')?.setValue(1);
      this.formulario.get('puerto_id')?.setValue(1);
      this.formulario.get('departamento_id')?.setValue(1);
      }
      
    //SI NO GUARDA O EDITA EL FORMULARIO DE FORMA EXITOSA SE MANTIENEN LOS DATOS
    }else{
      if(this.integridadTotalFlag){
        this.analisis.controls.forEach((fg: any, i: any) => { 
          fg.get('integridad')?.disable();
        });
        this.formulario.get('integridadtotal')?.enable();
      }
    }
  }

  loadingEvent(){
    this.loading.cambiaLoading();
  }
}
