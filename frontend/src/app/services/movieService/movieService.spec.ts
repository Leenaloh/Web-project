/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { MoviesService, MoviesPageState, Movie } from './movieService';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpMock: HttpTestingController;

  const base = 'http://localhost:8080/api/v1/movies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MoviesService],
    });

    service = TestBed.inject(MoviesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('searchMovies() should call GET /api/v1/movies with only non-empty query params', () => {
    const mockResponse: MoviesPageState = {
      page: 1,
      pageSize: 20,
      movies: [
        { id: 'tt001', title: 'Movie A', year: 2017, director: 'Dir A' },
        { id: 'tt002', title: 'Movie B', year: 1994, director: 'Dir B' },
      ],
    };

    service
      .searchMovies({
        title: 'abc',
        year: 1999,
        director: '',
        starName: undefined,
        page: 1,
        pageSize: 20,
      })
      .subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      (r: HttpRequest<any>) => r.method === 'GET' && r.url === base
    );
    expect(req.request.params.get('title')).toBe('abc');
    expect(req.request.params.get('year')).toBe('1999');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('pageSize')).toBe('20');
    expect(req.request.params.has('director')).toBeFalse();
    expect(req.request.params.has('starName')).toBeFalse();

    req.flush(mockResponse);
  });

  it('searchMovies({}) should call GET with no query params', () => {
    service.searchMovies({}).subscribe();

    const req = httpMock.expectOne(
      (r: HttpRequest<any>) => r.method === 'GET' && r.url === base
    );
    expect(req.request.params.keys().length).toBe(0);

    req.flush({ page: 1, pageSize: 20, movies: [] });
  });

  it('browseByGenre() should call GET /api/v1/movies/browseByGenre with genreId, page, pageSize', () => {
    const mockResponse: MoviesPageState = {
      page: 1,
      pageSize: 20,
      movies: [],
    };

    service.browseByGenre(7, 2, 10).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (r: HttpRequest<any>) =>
        r.method === 'GET' && r.url === `${base}/browseByGenre`
    );
    expect(req.request.params.get('genreId')).toBe('7');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('10');

    req.flush(mockResponse);
  });

  it('browseByFirstLetter() should call GET /api/v1/movies/browseByFirstLetter with startsWith, page, pageSize', () => {
    const mockResponse: MoviesPageState = {
      page: 1,
      pageSize: 20,
      movies: [],
    };

    service.browseByFirstLetter('A', 3, 5).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (r: HttpRequest<any>) =>
        r.method === 'GET' && r.url === `${base}/browseByFirstLetter`
    );
    expect(req.request.params.get('startsWith')).toBe('A');
    expect(req.request.params.get('page')).toBe('3');
    expect(req.request.params.get('pageSize')).toBe('5');

    req.flush(mockResponse);
  });

  it('getMovieById() should call GET /api/v1/movies/:id (encoded)', () => {
    const trickyId = 'tt/001 space';
    const expectedUrl = `${base}/${encodeURIComponent(trickyId)}`;
    const mockMovie: Movie = {
      id: trickyId,
      title: 'X',
      year: 2000,
      director: 'Y',
    };

    service.getMovieById(trickyId).subscribe((res) => {
      expect(res).toEqual(mockMovie);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockMovie);
  });

  it('autocompleteTitles() should call GET /api/v1/movies/autocomplete with query param', () => {
    const mockSuggestions = ['Avatar', 'Avengers'];

    service.autocompleteTitles('Av').subscribe((res) => {
      expect(res).toEqual(mockSuggestions);
    });

    const req = httpMock.expectOne(
      (r: HttpRequest<any>) =>
        r.method === 'GET' && r.url === `${base}/autocomplete`
    );
    expect(req.request.params.get('query')).toBe('Av');

    req.flush(mockSuggestions);
  });
});