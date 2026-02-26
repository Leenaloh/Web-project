import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { MovieListComponent } from './movie_list';
import { MoviesService } from '../../services/movieService/movieService';
import { of } from 'rxjs';

describe('MovieListComponent', () => {
  let fixture: ComponentFixture<MovieListComponent>;
  let component: MovieListComponent;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;
  let router: Router;

  beforeEach(async () => {
    moviesServiceSpy = jasmine.createSpyObj('MoviesService', ['searchMovies']);

    const activatedRouteStub = {
      snapshot: { queryParamMap: convertToParamMap({}) },
      queryParams: of({}),
      paramMap: of(convertToParamMap({})),
    };

    await TestBed.configureTestingModule({
      imports: [MovieListComponent],
      providers: [
        { provide: MoviesService, useValue: moviesServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('goDetails() should navigate to /movie_details with id query param', () => {
    const navSpy = spyOn(router, 'navigate');

    const id = 'tt002';
    component.goDetails(id);

    expect(navSpy).toHaveBeenCalledWith(['/movie_details'], {
      queryParams: { id },
    });
  });

  it('PHASE-3 (expected to FAIL now): should load movies from backend on init', () => {
    moviesServiceSpy.searchMovies.and.returnValue(
      of({ page: 1, pageSize: 20, total: 0, movies: [] })
    );

    fixture.detectChanges();

    expect(moviesServiceSpy.searchMovies).toHaveBeenCalled();
  });
});