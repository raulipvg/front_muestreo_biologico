import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalComponent, ModalConfig, ModalsModule } from 'src/app/_metronic/partials';

@Component({
  selector: 'modal-resp',
  standalone: true,
  imports: [
    NgSelectModule,
    FormsModule,
    ModalsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './modalresp.component.html',
  styleUrl: './modalresp.component.scss'
})
export class ModalRespComponent implements OnInit{
  @ViewChild('modal') private modalComponent: ModalComponent;
  
  modalConfig: ModalConfig = {
    modalTitle: 'Ver Respuesta',
    dismissButtonLabel: 'Actualizar',
    closeButtonLabel: 'Cerrar',
    onClose(): boolean{ return false;}
  };
  
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
  constructor(
    private fb: FormBuilder
  ){};

  
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
  FormSubmit() {
    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {    
      this.caca = JSON.stringify(this.formulario.getRawValue());
      console.log(`¡Formulario enviado! ${this.caca}`);
    }
  }
  get f() { return this.formulario.controls; }

  async AbrirModal(action?: string, id?:number){
    this.flag=true;
    this.formulario.reset();
    console.log('sdas '+id);
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
