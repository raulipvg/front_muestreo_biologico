import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAccionesComponent } from './modalacciones.component';

describe('ModalAccionesComponent', () => {
  let component: ModalAccionesComponent;
  let fixture: ComponentFixture<ModalAccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAccionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalAccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
