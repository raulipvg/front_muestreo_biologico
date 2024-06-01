import { Routes } from '@angular/router';
import { PruebasComponent } from './pruebas/pruebas.component'
import { RespuestaComponent } from './maestros/respuesta/respuesta.component';
import { FormulariosComponent } from './maestros/formularios/formularios.component';
import { BiologicoComponent } from './biologico/biologico.component';
import { biologicosRoutes } from './biologico/biologico-routing';
import { RespuestabiologicoComponent } from './maestros/respuestabiologico/respuestabiologico.component';
import { registrarFormularioBiologico, editRespFormularioBiologico } from '../services/formularios/formularios.guard';
import { verMaestrosBiologicos } from './biologico/maestros.guard';
import { verMaestroFormulario } from './maestros/formularios/maestroformularios.guard';

const Routing: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'adm/formularios',
    component: FormulariosComponent,
    canActivate: [verMaestroFormulario]
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
    canActivate: [editRespFormularioBiologico]
  },
  {
    path: 'pruebas',
    component:PruebasComponent
  },
  {
    path: 'maestros/respuestas',
    component: RespuestaComponent
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
