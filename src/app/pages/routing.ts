import { Routes } from '@angular/router';
import { PruebasComponent } from './pruebas/pruebas.component'

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
