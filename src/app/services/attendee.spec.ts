import { TestBed } from '@angular/core/testing';

import { Attendee } from './attendee';

describe('Attendee', () => {
  let service: Attendee;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Attendee);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
