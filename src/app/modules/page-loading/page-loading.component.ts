import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-loading.component.html',
  styleUrl: './page-loading.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class PageLoadingComponent {
  @Input() isLoading : boolean;


}
