import { Component, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent, ModalsModule } from '../../../_metronic/partials';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-modalReg',
  standalone: true,
  imports: [
    ModalsModule,
    NgSelectModule,
    FormsModule,
  ],
  templateUrl: './modalReg.component.html',
  styleUrl: './modalReg.component.scss'
})
export class ModalRegComponent {
  @ViewChild('modal') private modalComponent: ModalComponent;

  //Modal config
  modalConfig: ModalConfig = {
    modalTitle: 'GRAN TITULO GRAN DEL MODAL',
    dismissButtonLabel: 'Enviar',
    closeButtonLabel: 'Cancelamelo'
  };

  //ng-select data
  selectedCars = [3];
  cars = [
      { id: 1, name: 'Volvo' },
      { id: 2, name: 'Saab', disabled: true },
      { id: 3, name: 'Opel' },
      { id: 4, name: 'Audi' },
  ];  
  async abrirModal(){
    return await this.modalComponent.open();
  }

}
