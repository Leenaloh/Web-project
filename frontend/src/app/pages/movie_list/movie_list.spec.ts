import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { MovieListComponent } from './movie_list';
import { MoviesService } from '../../services/movieService/movieService';
import { CartService } from '../../services/cartService/cartService';
import { AuthService } from '../../services/authService/authService';
import { of } from 'rxjs';

describe('MovieListComponent', () => {
  let fixture: ComponentFixture<MovieListComponent>;
  let component: MovieListComponent;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    moviesServiceSpy = jasmine.createSpyObj('MoviesService', [
      'searchMovies',
      'browseByGenre',
      'browseByFirstLetter',
    ]);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addItem', 'rememberMovieTitle']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    authServiceSpy.logout.and.returnValue(of(void 0));

    const activatedRouteStub = {
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [MovieListComponent],
      providers: [
        { provide: MoviesService, useValue: moviesServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
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

  it('should load movies from backend on init using searchMovies', () => {
    moviesServiceSpy.searchMovies.and.returnValue(
      of({ page: 1, pageSize: 20, totalPages: 1, totalResults: 0, movies: [] })
    );

    fixture.detectChanges();

    expect(moviesServiceSpy.searchMovies).toHaveBeenCalledWith({
      title: '',
      year: undefined,
      director: '',
      starName: '',
      page: 1,
      pageSize: 20,
    });
  });

  it('should call cart service when clicking Add to Cart', () => {
    cartServiceSpy.addItem.and.returnValue(of({ items: [{ movieId: 'tt001', quantity: 1 }] }));

    component.addToCart({ id: 'tt001', title: 'Bambola' });

    expect(cartServiceSpy.rememberMovieTitle).toHaveBeenCalledWith('tt001', 'Bambola');
    expect(cartServiceSpy.addItem).toHaveBeenCalledWith('tt001', 1);
    expect(component.success).toBe('Added to cart');
  });

  it('goDetails() should navigate to /movie_details with id query param', () => {
    const navSpy = spyOn(router, 'navigate');

    component.goDetails('tt002');

    expect(navSpy).toHaveBeenCalledWith(['/movie_details'], {
      queryParams: { id: 'tt002' },
    });
  });

  it('goToPage() should navigate with merged query params', () => {
    const navSpy = spyOn(router, 'navigate');
    component.page = 1;
    component.pageSize = 20;
    component.totalPages = 5;

    component.goToPage(2);

    expect(navSpy).toHaveBeenCalledWith([], {
      relativeTo: jasmine.anything(),
      queryParams: { page: 2, pageSize: 20 },
      queryParamsHandling: 'merge',
    });
  });

  it('pages should return a window of 7 page numbers around current page', () => {
    component.page = 5;
    component.totalPages = 10;

    expect(component.pages).toEqual([2, 3, 4, 5, 6, 7, 8]);
  });
});
