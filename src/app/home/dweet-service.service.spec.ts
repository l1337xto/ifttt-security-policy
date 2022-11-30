import { TestBed } from '@angular/core/testing';

import { DweetServiceService } from './dweet-service.service';

describe('DweetServiceService', () => {
  let service: DweetServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DweetServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
