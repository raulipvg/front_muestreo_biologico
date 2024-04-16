import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalregistrarComponent } from './modalregistrar.component';

describe('ModalregistrarComponent', () => {
  let component: ModalregistrarComponent;
  let fixture: ComponentFixture<ModalregistrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalregistrarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalregistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
