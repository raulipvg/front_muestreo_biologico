import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { languageConfig } from '../../../assets/sass/core/base/datatables/language_es';
import { UsersService } from '../../services/users/users.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import { ModalRegistrarComponent } from './modalregistrar/modalregistrar.component'
import { EspeciesComponent } from '../maestros/especies/especies.component';
import { NavesComponent } from '../maestros/naves/naves.component';
import { PlantasComponent } from '../maestros/plantas/plantas.component';
import { LugaresmComponent } from '../maestros/lugaresm/lugaresm.component';
import { ClasificacionesComponent } from '../maestros/clasificaciones/clasificaciones.component';
import { FlotasComponent } from '../maestros/flotas/flotas.component';
import { PuertosComponent } from '../maestros/puertos/puertos.component';
import { DepartamentosComponent } from '../maestros/departamentos/departamentos.component';
import { PersonasComponent } from '../maestros/personas/personas.component';



@Component({
  selector: 'app-pruebas3',
  standalone: true,
  imports: [
    CommonModule,
    DataTablesModule,
    HttpClientModule, 
    NgbTooltip, 
    ModalRegistrarComponent,
    EspeciesComponent,
    NavesComponent,
    PlantasComponent,
    LugaresmComponent,
    ClasificacionesComponent,
    FlotasComponent,
    PuertosComponent,
    DepartamentosComponent,
    PersonasComponent
  ],
  templateUrl: './pruebas3.component.html',
  styleUrl: './pruebas3.component.scss'
})
export class Pruebas3Component{
  

}
