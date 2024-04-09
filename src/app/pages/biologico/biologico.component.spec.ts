import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiologicoComponent } from './biologico.component';

describe('BiologicoComponent', () => {
  let component: BiologicoComponent;
  let fixture: ComponentFixture<BiologicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiologicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BiologicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
