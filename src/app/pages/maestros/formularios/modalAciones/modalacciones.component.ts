import { Component, Output, ViewChild, EventEmitter, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalConfig, ModalsModule, ModalComponent } from 'src/app/_metronic/partials';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'modal-acciones',
  standalone: true,
  imports: [
    NgSelectModule,
    FormsModule,
    ModalsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './modalacciones.component.html',
  styleUrl: './modalacciones.component.scss'
})

export class ModalAccionesComponent implements OnInit {
  
  @ViewChild('modal') private modalComponent: ModalComponent;
  nombre ?: string = 'Oye que gran formulario';
  selectedCars: number[] = [];
  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab', disabled: true },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
];
  registerForm: FormGroup;
  caca='';
  modalConfig: ModalConfig = {
    modalTitle: `Formulario: ${this.nombre}`,
    dismissButtonLabel: 'Enviar',
    closeButtonLabel: 'Cerrar',
    onClose(): boolean{ return false;}
    

  };
  constructor( 
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
  )
  {};
  ngOnInit(): void {
   
    this.initValidacion();
  
  }
  initValidacion() {
    
    this.registerForm = this.fb.group({
      nombre: ['',Validators.compose([
                Validators.required,
                Validators.minLength(4) ])],
      descripcion: ['',Validators.compose([
                Validators.required,
                Validators.maxLength(50)
                  ])],
      enabled: ['',Validators.compose([
                Validators.required
                ])],

    });
  }
  registerFormSubmit() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      // Enviar el formulario aquí (por ejemplo, usando un servicio o llamada a la API)
      console.log('¡Formulario enviado!');
     this.caca = JSON.stringify(this.registerForm.getRawValue());
    }
  }
  get f() { return this.registerForm.controls; }

  async AbrirModal(action?: string, id?:number){
    this.registerForm.reset();
    
    switch (action) {
      case 'ver':
        this.cdRef.detectChanges();
        break;
      case 'edit':
        this.cdRef.detectChanges();
        break;
      default:
        this.cdRef.detectChanges();
        break;
    }
    return await this.modalComponent.open();
  }

  async CerrarModal(){
    return await this.modalComponent.dismiss();
  }
}
