import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { MovieListComponent } from './movie_list';
import { MoviesService } from '../../services/movieService/movieService';
import { CartService } from '../../services/cartService/cartService';
import { of } from 'rxjs';

describe('MovieListComponent', () => {
  let fixture: ComponentFixture<MovieListComponent>;
  let component: MovieListComponent;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let router: Router;

  beforeEach(async () => {
    moviesServiceSpy = jasmine.createSpyObj('MoviesService', ['searchMovies']);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addItem', 'rememberMovieTitle']);

    const activatedRouteStub = {
      snapshot: { queryParamMap: convertToParamMap({}) },
      queryParams: of({}),
      paramMap: of(convertToParamMap({})),
    };

    await TestBed.configureTestingModule({
      imports: [MovieListComponent],
      providers: [
        { provide: MoviesService, useValue: moviesServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
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

  it('should call cart service when clicking Add to Cart', () => {
    cartServiceSpy.addItem.and.returnValue(of({ items: [{ movieId: 'tt001', quantity: 1 }] }));

    component.addToCart({ id: 'tt001', title: 'Bambola' });

    expect(cartServiceSpy.addItem).toHaveBeenCalledWith('tt001', 1);
    expect(component.success).toBe('Added to cart');
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
      of({ page: 1, pageSize: 20, movies: [] })
    );

    fixture.detectChanges();

    expect(moviesServiceSpy.searchMovies).toHaveBeenCalled();
  });
});
