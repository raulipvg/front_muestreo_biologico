import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-adm-maestros',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './adm-maestros.component.html',
  styleUrl: './adm-maestros.component.scss'
})
export class AdmMaestrosComponent {

}
