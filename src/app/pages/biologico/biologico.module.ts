import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BiologicoComponent } from './biologico.component';

@NgModule({
  declarations: [BiologicoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BiologicoComponent,
      },
    ])
  ],
})
export class BiologicoModule {}
