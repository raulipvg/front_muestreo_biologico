import { Routes } from '@angular/router';
import { PruebasComponent } from './pruebas/pruebas.component'
import { Pruebas3Component } from './pruebas3/pruebas3.component'
import { RespuestaComponent } from './maestros/respuesta/respuesta.component';
import { FormulariosComponent } from './maestros/formularios/formularios.component';
import { BiologicoComponent } from './biologico/biologico.component';

const Routing: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'biologico',
    component: BiologicoComponent    
  },
  {
    path: 'pruebas',
    component:PruebasComponent
  },
  {
    path: 'pruebas3',
    component:Pruebas3Component
  },
  {
    path: 'maestros/respuestas',
    component: RespuestaComponent
  },
  {
    path: 'maestros/formularios',
    component: FormulariosComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
