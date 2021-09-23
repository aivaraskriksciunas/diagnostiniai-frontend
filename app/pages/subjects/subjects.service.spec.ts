import { TestBed, inject } from '@angular/core/testing';

import { SubjectsService } from '../../shared/services/subjects.service';

describe('SubjectsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubjectsService]
    });
  });

  it('should be created', inject([SubjectsService], (service: SubjectsService) => {
    expect(service).toBeTruthy();
  }));
});
