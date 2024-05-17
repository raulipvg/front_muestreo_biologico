import { Routes } from '@angular/router';
import { PruebasComponent } from './pruebas/pruebas.component'
import { Pruebas3Component } from './pruebas3/pruebas3.component'
import { RespuestaComponent } from './maestros/respuesta/respuesta.component';
import { FormulariosComponent } from './maestros/formularios/formularios.component';
import { BiologicoComponent } from './biologico/biologico.component';
import { biologicosRoutes } from './biologico/biologico-routing';
import { GcallbackComponent } from './gcallback/gcallback.component';
import { RespuestabiologicoComponent } from './maestros/respuestabiologico/respuestabiologico.component';
import { registrarFormularioBiologico, vereditRespFormularioBiologico } from '../services/formularios/formularios.guard';
import { verMaestrosBiologicos } from './biologico/maestros.guard';

const Routing: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'adm',
    children:biologicosRoutes,
    canActivate: [verMaestrosBiologicos]
  },
  {
    path: 'biologico', // Ruta vacía para BiologicoComponent
    component: RespuestabiologicoComponent,
  },
  {
    path: 'biologico/ingresar',
    component: BiologicoComponent,
    canActivate: [registrarFormularioBiologico]
  },
  {
    path: 'biologico/:id',
    component: BiologicoComponent,
    canActivate: [vereditRespFormularioBiologico]
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
