import { Component, Output, ViewChild, EventEmitter, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalConfig, ModalsModule, ModalComponent } from 'src/app/_metronic/partials';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormulariosService, IFormularioModel } from '../../../../services/formularios/formularios.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';



@Component({
  selector: 'modal-acciones',
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
  nombre ?: string = 'Editar';
  selectedCars: number[] = [];
  items = [
    { id: true, name: 'Habilitado' },
    { id: false, name: 'Deshabilitado' }
];
  formulario: FormGroup;
  caca='';
  modalConfig: ModalConfig = {
    modalTitle: `Formulario: ${this.nombre}`,
    dismissButtonLabel: 'Enviar',
    closeButtonLabel: 'Cerrar',
    onClose(): boolean{ return false;}
    

  };

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};
  @Output() cambiosAllUsuariosEvent = new EventEmitter<IFormularioModel>();

  @Input() isLoading : boolean;
  constructor(
    private formulariosService: FormulariosService, 
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
      titulo: ['',Validators.compose([
                Validators.required,
                Validators.minLength(4) ])],
      descripcion: ['',Validators.compose([
                Validators.required,
                Validators.maxLength(50)
                  ])],
      enabled: ['',Validators.compose([
                Validators.required
                ])]
    });
  }
  Submit() {
    this.isLoading = true;
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
      this.formulariosService.update(this.formulario.getRawValue()).subscribe({
        next: (data: IFormularioModel) => {
          
         
          this.cambiosAllUsuariosEvent.emit(data);
          this.showAlert(successAlert);
          this.CerrarModal();
          //console.log('se cambio');
          //this.modal.AbrirModal(action, id,data);
        },
        error: (error: HttpErrorResponse) => {
          this.showAlert(errorAlert);
          //console.log('error: '+error.status);
          //MANEJAR ERROR
        },
        complete: () => {
          this.isLoading = false;
         // btn.removeAttribute('data-kt-indicator');
        }
      });


    }
  }

  get f() { return this.formulario.controls; }

  async AbrirModal(action?: string, id?:number, data?:any){
    this.formulario.reset();
    
    switch (action) {
      case 'ver':
        this.cdRef.detectChanges();
        break;
      case 'edit':
        //console.log(data);
        //this.formulario.get('nombre')?.setValue(data.Titulo);;
        this.formulario.setValue(data);

        //this.cdRef.detectChanges();
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
