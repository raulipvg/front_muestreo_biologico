import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormulariosService } from 'src/app/services/formularios/formularios.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {

  constructor(
    public servicio: FormulariosService, 
  ) {
    this.servicio.getFormulariosEnabled().subscribe();
  }

  ngOnInit(): void {
  }

}
