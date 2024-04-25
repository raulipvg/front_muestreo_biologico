import { Component, Output, ViewChild, EventEmitter, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalConfig, ModalsModule, ModalComponent } from 'src/app/_metronic/partials';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlotasService, IFlotaModel } from '../../../../services/flotas/flotas.service';
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
  selectedCars: number[] = [];
  items = [
    { id: true, name: 'Habilitado' },
    { id: false, name: 'Deshabilitado' }
  ];
  formulario: FormGroup;
  modalConfig: ModalConfig = {
    modalTitle: `Flota: ${this.nombre}`,
    dismissButtonLabel: 'Enviar',
    closeButtonLabel: 'Cerrar',
    onClose(): boolean{ return false;}
  };

  editar : boolean = false;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  @Output() cambioRowEvent = new EventEmitter<IFlotaModel>();
  @Output() agregaRowEvent = new EventEmitter<IFlotaModel>();
  @Output() loadingEvent = new EventEmitter<boolean>();


  constructor(
    private servicio: FlotasService, 
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
      text: this.editar ? 'Flota actualizada' : 'Flota registrada'
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
          next: (data: IFlotaModel) => {        
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
          next: (data:IFlotaModel) => {
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
      /*case 'ver':
        console.log(this.boton)
        this.boton.textContent = 'Actualizar';
        this.cdRef.detectChanges();
        break;*/
      case 'edit':
        this.modalConfig.modalTitle = 'Editar'
        this.editar = true;
        this.formulario.setValue(data);
        this.cdRef.detectChanges();
        break;
      case 'create':
        this.modalConfig.modalTitle = 'Registrar'
        this.editar = false;
        this.formulario.reset();
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
