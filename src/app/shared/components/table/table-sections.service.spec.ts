import { TestBed } from '@angular/core/testing';

import { TableSectionsService } from './table-sections.service';

describe('TableSectionsService', () => {
  let service: TableSectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableSectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
