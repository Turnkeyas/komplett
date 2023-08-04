import { TestBed } from '@angular/core/testing';

import { JspdfFontService } from './jspdf-font.service';

describe('JspdfFontService', () => {
  let service: JspdfFontService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JspdfFontService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
