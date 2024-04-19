import { Component, Output, ViewChild, EventEmitter, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalConfig, ModalsModule, ModalComponent } from 'src/app/_metronic/partials';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlantasService, IPlantaModel } from '../../../../services/plantas/plantas.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { booleanValidator } from 'src/app/modules/booleanValidator';


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
    modalTitle: `Planta: ${this.nombre}`,
    dismissButtonLabel: 'Enviar',
    closeButtonLabel: 'Cerrar',
    onClose(): boolean{ return false;}
  };

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  @Output() cambioRowEvent = new EventEmitter<IPlantaModel>();
  @Output() loadingEvent = new EventEmitter<boolean>();


  constructor(
    private servicio: PlantasService, 
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
      text: 'Formulario actualizado!',
    };
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: '',
    };

    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {
      // Enviar el formulario aquí (por ejemplo, usando un servicio o llamada a la API)
      this.servicio.update(this.formulario.getRawValue()).subscribe({
        next: (data: IPlantaModel) => {        
          this.cambioRowEvent.emit(data);
          this.showAlert(successAlert);
          this.CerrarModal();
        },
        error: (error: HttpErrorResponse) => {
          this.showAlert(errorAlert);
        },
        complete: () => {
          this.loadingEvent.emit();
        }
      });


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
        this.boton.textContent = 'Actualizar';
        this.formulario.setValue(data);
        this.cdRef.detectChanges();
        break;
      case 'create':
        this.boton.textContent = 'Registrar';
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
