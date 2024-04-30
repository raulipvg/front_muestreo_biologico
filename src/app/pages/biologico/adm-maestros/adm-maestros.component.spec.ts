import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmMaestrosComponent } from './adm-maestros.component';

describe('AdmMaestrosComponent', () => {
  let component: AdmMaestrosComponent;
  let fixture: ComponentFixture<AdmMaestrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmMaestrosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmMaestrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
