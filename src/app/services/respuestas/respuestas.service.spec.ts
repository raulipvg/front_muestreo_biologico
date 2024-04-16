import { TestBed } from '@angular/core/testing';

import { RespuestasService } from './respuestas.service';

describe('RespuestasServiceService', () => {
  let service: RespuestasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RespuestasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
