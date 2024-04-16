import { Component, Output, ViewChild, EventEmitter, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalConfig, ModalsModule, ModalComponent } from 'src/app/_metronic/partials';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'modal-registrar',
  standalone: true,
  imports: [
    NgSelectModule,
    FormsModule,
    ModalsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './modalregistrar.component.html',
  styleUrl: './modalregistrar.component.scss'
})

export class ModalRegistrarComponent implements OnInit {
  
  @ViewChild('modal') private modalComponent: ModalComponent;
  @Input() abrirModal = new EventEmitter();

  selectedCars: number[] = [];
  flag: boolean =false;
  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab', disabled: true },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
];
  registerForm: FormGroup;
  caca='';
  modalConfig: ModalConfig = {
    modalTitle: 'GRAN TITULO GRAN DEL MODAL',
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
      name: ['',Validators.compose([
                Validators.required,
                Validators.minLength(4) ])],
      auto: ['',Validators.compose([
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
    this.flag=true;
    this.registerForm.reset();
    //console.log(action);
    switch (action) {
      case 'ver':
        this.selectedCars = [1];
        this.cdRef.detectChanges();
        break;
      case 'edit':
        this.flag=false;
        this.selectedCars = [];
        this.cdRef.detectChanges();
        break;
      case 'delete':
        //console.log('delete');
        break;
      default:
        this.selectedCars = [2];
        this.cdRef.detectChanges();
        //console.log('create');
        break;
    }
    //this.selectedCars = [];
              //this.cdRef.detectChanges();
    return await this.modalComponent.open();
  }

  async CerrarModal(event: Event){
    event.stopPropagation(); 
    return await this.modalComponent.dismiss();
  }
}
