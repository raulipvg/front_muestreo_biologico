import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { privilegiosMaestrosBiologicos } from 'src/app/pages/biologico/maestros.guard';
import { privilegiosMaestroFormulario } from 'src/app/pages/maestros/formularios/maestroformularios.guard';
import { FormulariosService } from 'src/app/services/formularios/formularios.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  verBiologico: boolean = privilegiosMaestrosBiologicos(1);
  verFormulario: boolean = privilegiosMaestroFormulario(1);
  constructor(
    public servicio: FormulariosService, 
  ) {
    this.servicio.getFormulariosEnabled().subscribe();
  }
 

  ngOnInit(): void {
  }

}
