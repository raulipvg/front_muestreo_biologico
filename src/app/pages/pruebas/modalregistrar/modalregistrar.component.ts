import { Component, Output, ViewChild, EventEmitter, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalConfig, ModalsModule, ModalComponent, DropdownMenusModule } from 'src/app/_metronic/partials';
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
    CommonModule,
    DropdownMenusModule
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
  formulario: FormGroup;
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

    this.formulario.get('auto')?.valueChanges.subscribe(value => {
      console.log('Valor seleccionado:', value);
    });
  
  }
  initValidacion() {
    
    this.formulario = this.fb.group({
      name: ['',Validators.compose([
                Validators.required,
                Validators.minLength(4) ])],
      auto: ['',Validators.compose([
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

  async AbrirModal(action?: string, id?:number){
    this.flag=true;
    this.formulario.reset();
    console.log(action+ ' '+id);
    switch (action) {
      case 'ver':
        this.formulario.get('auto')?.setValue([3]);
        //this.selectedCars = [1];
        //this.cdRef.detectChanges();
        break;
      case 'edit':
        this.flag=false;
        //this.selectedCars = [];
        this.formulario.get('auto')?.setValue([]);

        //this.cdRef.detectChanges();
        break;
      case 'delete':
        //console.log('delete');
        break;
      default:
        //this.selectedCars = [2];
       //this.cdRef.detectChanges();
        this.formulario.get('auto')?.setValue([2]);
        //console.log('create');
        break;
    }
    //this.selectedCars = [];
              //this.cdRef.detectChanges();
    return await this.modalComponent.open();
  }

  async CerrarModal(){
    //event.stopPropagation(); 
    return await this.modalComponent.dismiss();
  }
}
