import { Routes } from "@angular/router";
import { ClasificacionesComponent } from "../maestros/clasificaciones/clasificaciones.component";
import { DepartamentosComponent } from "../maestros/departamentos/departamentos.component";
import { EspeciesComponent } from "../maestros/especies/especies.component";
import { FlotasComponent } from "../maestros/flotas/flotas.component";
import { LugaresmComponent } from "../maestros/lugaresm/lugaresm.component";
import { NavesComponent } from "../maestros/naves/naves.component";
import { PlantasComponent } from "../maestros/plantas/plantas.component";
import { PersonasComponent } from "../maestros/personas/personas.component";
import { PuertosComponent } from "../maestros/puertos/puertos.component";
import { AdmMaestrosComponent } from "./adm-maestros/adm-maestros.component";
import { BiologicoComponent } from "./biologico.component";


export const biologicosRoutes: Routes = [
  {
    path: 'biologico',
    component: AdmMaestrosComponent,
    children: [
      {
        path: 'clasificaciones',
        component: ClasificacionesComponent,
      },
      {
          path: 'departamentos',
          component: DepartamentosComponent,
        },
      {
        path: 'especies',
        component: EspeciesComponent,
      },
      {
        path: 'flotas',
        component: FlotasComponent,
      },
      {
        path: 'lugaresm',
        component: LugaresmComponent,
      },
      {
        path: 'naves',
        component: NavesComponent,
      },
      {
        path: 'personas',
        component: PersonasComponent,
      },
      {
        path: 'plantas',
        component: PlantasComponent,
      },
      {
        path: 'puertos',
        component: PuertosComponent,
      },
      {
        path:'', redirectTo:'clasificaciones', pathMatch: 'full'
      },
      {
        path:'**', redirectTo:'clasificaciones', pathMatch: 'full'
      },
    ]
  },
  {
    path:'', redirectTo:'biologico', pathMatch: 'full'
  },
  {
    path:'**', redirectTo:'biologico', pathMatch: 'full'
  },
];