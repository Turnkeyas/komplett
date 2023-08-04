import { TestBed } from '@angular/core/testing';

import { MakePDFService } from './make-pdf.service';

describe('MakePDFService', () => {
  let service: MakePDFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MakePDFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
