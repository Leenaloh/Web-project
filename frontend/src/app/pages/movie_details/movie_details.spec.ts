import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { MovieDetailsComponent } from './movie_details';
import { MoviesService } from '../../services/movieService/movieService';
import { of } from 'rxjs';

describe('MovieDetailsComponent', () => {
  let fixture: ComponentFixture<MovieDetailsComponent>;
  let component: MovieDetailsComponent;

  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;
  let router: Router;

  beforeEach(async () => {
    moviesServiceSpy = jasmine.createSpyObj('MoviesService', ['getMovieById']);

    const activatedRouteStub = {
      snapshot: { queryParamMap: convertToParamMap({ id: 'tt001' }) },
      queryParams: of({ id: 'tt001' }),
      paramMap: of(convertToParamMap({})),
    };

    await TestBed.configureTestingModule({
      imports: [MovieDetailsComponent],
      providers: [
        { provide: MoviesService, useValue: moviesServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('inc() should increase qty', () => {
    component.qty = 1;
    component.inc();
    expect(component.qty).toBe(2);
  });

  it('dec() should NOT go below 1', () => {
    component.qty = 1;
    component.dec();
    expect(component.qty).toBe(1);
  });

  it('goStar() should navigate to /star_details with id query param', () => {
    const navSpy = spyOn(router, 'navigate');

    const starId = 'nm001';
    component.goStar(starId);

    expect(navSpy).toHaveBeenCalledWith(['/star_details'], {
      queryParams: { id: starId },
    });
  });

  it('PHASE-3 (expected to FAIL now): should load movie by id from route on init', () => {
    moviesServiceSpy.getMovieById.and.returnValue(of({ id: 'tt001', title: 'X' } as any));

    fixture.detectChanges();

    expect(moviesServiceSpy.getMovieById).toHaveBeenCalledWith('tt001');
  });
});