import { TestBed } from '@angular/core/testing';

import { GeographicInfoService } from './geographic-info.service';

describe('GeographicInfoService', () => {
  let service: GeographicInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeographicInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
