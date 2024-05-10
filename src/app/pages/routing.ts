import { Routes } from '@angular/router';
import { PruebasComponent } from './pruebas/pruebas.component'
import { Pruebas3Component } from './pruebas3/pruebas3.component'
import { RespuestaComponent } from './maestros/respuesta/respuesta.component';
import { FormulariosComponent } from './maestros/formularios/formularios.component';
import { BiologicoComponent } from './biologico/biologico.component';
import { biologicosRoutes } from './biologico/biologico-routing';
import { GcallbackComponent } from './gcallback/gcallback.component';
import { RespuestabiologicoComponent } from './maestros/respuestabiologico/respuestabiologico.component';

const Routing: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'adm',
    children:biologicosRoutes
  },
  {
    path: 'biologico', // Ruta vacía para BiologicoComponent
    component: RespuestabiologicoComponent,
  },
  {
    path: 'biologico/ingresar',
    component: BiologicoComponent,
  },
  {
    path: 'biologico/:id',
    component: BiologicoComponent,
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
    path: 'google/callback',
    component: GcallbackComponent,
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
