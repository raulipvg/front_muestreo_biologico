import { Component, Output, ViewChild, EventEmitter, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalConfig, ModalsModule, ModalComponent } from 'src/app/_metronic/partials';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EspeciesService, IEspecieModel } from '../../../../services/especies/especies.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { booleanValidator } from 'src/app/modules/customValidators';


@Component({
  selector: 'modal-acciones-especies',
  standalone: true,
  imports: [
    NgSelectModule,
    FormsModule,
    ModalsModule,
    ReactiveFormsModule,
    CommonModule,
    SweetAlert2Module
  ],
  templateUrl: './modalacciones.component.html',
  styleUrl: './modalacciones.component.scss'
})

export class ModalAccionesComponent implements OnInit {
  
  @ViewChild('modal') private modalComponent: ModalComponent;
  @ViewChild('boton') boton : HTMLElement;

  nombre ?: string = 'Editar';
  ver : boolean = false;
  selectedCars: number[] = [];
  items = [
    { id: true, name: 'Habilitado' },
    { id: false, name: 'Deshabilitado' }
  ];
  formulario: FormGroup;
  modalConfig: ModalConfig = {
    modalTitle: `Especie: ${this.nombre}`,
    dismissButtonLabel: 'Enviar',
    closeButtonLabel: 'Cerrar',
    onClose(): boolean{ return false;}
  };

  editar : boolean = false;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  @Output() cambioRowEvent = new EventEmitter<IEspecieModel>();
  @Output() agregaRowEvent = new EventEmitter<IEspecieModel>();
  @Output() loadingEvent = new EventEmitter<boolean>();


  constructor(
    private servicio: EspeciesService, 
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
  )
  {};
  ngOnInit(): void {
    this.initValidacion();
  
  }
  initValidacion() {
    
    this.formulario = this.fb.group({
      id: [''],
      nombre: ['',Validators.compose([
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(100) 
                  ])
                ],
      talla_max: ['',Validators.compose([
                      Validators.required,
                      
                    ])],
      talla_min: ['',Validators.compose([
                      Validators.required,
                      Validators.min(0)
                    ])],
      peso_max: ['',Validators.compose([
                      Validators.required,
                      
                    ])],
      peso_min: ['',Validators.compose([
                      Validators.required,
                      Validators.min(0)
                    ])],
      talla_menor_a: ['',Validators.compose([
                          Validators.required,
                          Validators.min(0)
                        ])],
      enabled: ['',Validators.compose([
                    Validators.required,
                    booleanValidator
                  ])
                ]
    });
  }
  
  Submit() {
    this.loadingEvent.emit();
    const successAlert: SweetAlertOptions = {
      icon: 'success',
      title: 'Exito',
      text: this.editar ? 'Especie actualizada' : 'Especie registrada'
    };
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: '',
    };

    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {
      if(this.editar){
        this.servicio.update(this.formulario.getRawValue()).subscribe({
          next: (data: IEspecieModel) => {        
            this.cambioRowEvent.emit(data);
            this.showAlert(successAlert);
            this.CerrarModal();
            this.loadingEvent.emit();
          },
          error: (error: HttpErrorResponse) => {
            this.showAlert(errorAlert);
            this.loadingEvent.emit();
          }
        });
      }
      else{
        this.servicio.crear(this.formulario.getRawValue()).subscribe({
          next: (data:IEspecieModel) => {
            this.agregaRowEvent.emit(data);
            this.showAlert(successAlert);
            this.CerrarModal();
            this.loadingEvent.emit();
          },
          error: (error: HttpErrorResponse) => {
            this.showAlert(errorAlert);
            this.loadingEvent.emit();
          }
            
        })
      }
      // Enviar el formulario aquí (por ejemplo, usando un servicio o llamada a la API)
      


    }
  }

  get f() { return this.formulario.controls; }

  async AbrirModal(action?: string, id?:number, data?:any){
    this.formulario.reset();
    
    switch (action) {
      case 'ver':
        this.ver = true;
        this.modalConfig.modalTitle = 'Ver';
        this.formulario.setValue(data);
        this.formulario.disable();
        this.cdRef.detectChanges();
        break;
      case 'edit':
        this.ver = false;
        this.modalConfig.modalTitle = 'Editar'
        this.editar = true;
        this.formulario.setValue(data);
        this.formulario.enable();
        this.cdRef.detectChanges();
        break;
      case 'create':
        this.ver = false;
        this.modalConfig.modalTitle = 'Registrar'
        this.editar = false;
        this.formulario.reset();
        this.formulario.enable();
        this.cdRef.detectChanges();
        break;
      default:
        this.cdRef.detectChanges();
        break;
    }
    return await this.modalComponent.open();
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

  async CerrarModal(){
    return await this.modalComponent.dismiss();
  }
}
