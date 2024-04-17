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
  constructor( 
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
                ])],

    });
  }
  registerFormSubmit() {
    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {
      // Enviar el formulario aquí (por ejemplo, usando un servicio o llamada a la API)
      console.log('¡Formulario enviado!');
     this.caca = JSON.stringify(this.formulario.getRawValue());
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
        console.log(data);
        //this.formulario.get('nombre')?.setValue(data.Titulo);
        //this.formulario.get('descripcion')?.setValue(data.Descripcion);
        //this.formulario.get('enabled')?.setValue(data.Enabled);
        this.formulario.setValue(data);

        //this.cdRef.detectChanges();
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
