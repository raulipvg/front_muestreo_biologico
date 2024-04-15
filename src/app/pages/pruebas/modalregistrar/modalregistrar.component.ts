import { Component, ViewChild, EventEmitter, Input, ChangeDetectorRef  } from '@angular/core';
import { ModalConfig, ModalsModule, ModalComponent } from 'src/app/_metronic/partials';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'modal-registrar',
  standalone: true,
  imports: [
    NgSelectModule,
    FormsModule,
    ModalsModule
  ],
  templateUrl: './modalregistrar.component.html',
  styleUrl: './modalregistrar.component.scss'
})
      
export class ModalRegistrarComponent {
  @ViewChild('modal') private modalComponent: ModalComponent;
  @Input() abrirModal = new EventEmitter();

  constructor(private cdRef: ChangeDetectorRef){}  

  selectedCars: number[] = [];
  flag: boolean =false;
  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
];

  modalConfig: ModalConfig = {
    modalTitle: 'GRAN TITULO GRAN DEL MODAL',
    dismissButtonLabel: 'Enviar',
    closeButtonLabel: 'Cerrar',
    onClose(): boolean{ return false;}
    

  };

  async AbrirModal(action?: string, id?:number){
    this.flag=true;
    console.log(action);
    switch (action) {
      case 'ver':
        this.selectedCars = [1];
        this.cdRef.detectChanges();
        break;
      case 'edit':
        this.flag=false;
       // this.modalito.AbrirModal(action, id);
        this.selectedCars = [];
        this.cdRef.detectChanges();
        break;
      case 'delete':
        //console.log('delete');
        break;
      default:
        this.selectedCars = [2];
        //console.log('create');
        break;
    }
    //this.selectedCars = [];
    this.cdRef.detectChanges();
    return await this.modalComponent.open();
  }
}
