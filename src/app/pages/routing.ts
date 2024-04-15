import { Routes } from '@angular/router';
import { PruebasComponent } from './pruebas/pruebas.component'
import { Pruebas2Component } from './pruebas2/pruebas2.component'

const Routing: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'biologico',
    loadChildren: () => import('./biologico/biologico.module').then((m) => m.BiologicoModule),
  },
  {
    path: 'pruebas',
    component:PruebasComponent
  },
  {
    path: 'pruebas2',
    component:Pruebas2Component
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
