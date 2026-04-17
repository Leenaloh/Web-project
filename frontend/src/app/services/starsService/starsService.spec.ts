import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { StarsService, Star } from './starsService';

describe('StarsService', () => {
  let service: StarsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StarsService],
    });

    service = TestBed.inject(StarsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call GET /api/v1/stars/:id', () => {
    const mockStar: Star = {
      id: 'nm001',
      name: 'Actor',
      birthYear: 1980,
      movies: [],
    };

    service.getStarById('nm001').subscribe((res) => {
      expect(res).toEqual(mockStar);
    });

    const req = httpMock.expectOne(
      'http://localhost:8080/api/v1/stars/nm001'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockStar);
  });
});