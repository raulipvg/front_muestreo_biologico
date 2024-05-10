import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestabiologicoComponent } from './respuestabiologico.component';

describe('RespuestabiologicoComponent', () => {
  let component: RespuestabiologicoComponent;
  let fixture: ComponentFixture<RespuestabiologicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RespuestabiologicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RespuestabiologicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
