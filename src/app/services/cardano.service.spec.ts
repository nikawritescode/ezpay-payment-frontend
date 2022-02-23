import { TestBed } from '@angular/core/testing';

import { CardanoService } from './cardano.service';

describe('CardanoService', () => {
  let service: CardanoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardanoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
