import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRegComponent } from './modalReg.component';

describe('ModalRegComponent', () => {
  let component: ModalRegComponent;
  let fixture: ComponentFixture<ModalRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRegComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
