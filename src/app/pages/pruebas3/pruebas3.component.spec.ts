import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pruebas3Component } from './pruebas3.component';

describe('Pruebas3Component', () => {
  let component: Pruebas3Component;
  let fixture: ComponentFixture<Pruebas3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pruebas3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Pruebas3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
