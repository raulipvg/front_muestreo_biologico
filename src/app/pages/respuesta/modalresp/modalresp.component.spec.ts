import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalrespComponent } from './modalresp.component';

describe('ModalrespComponent', () => {
  let component: ModalrespComponent;
  let fixture: ComponentFixture<ModalrespComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalrespComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalrespComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
