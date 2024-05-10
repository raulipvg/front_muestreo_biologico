import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CookieComponent } from 'src/app/_metronic/kt/components';

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
export class AdmMaestrosComponent implements OnInit{
  permi : any;
  ngOnInit(): void {
    this.permi = CookieComponent.get('permisos');
    this.permi = this.permi ? JSON.parse(this.permi) : null;
  }
}
