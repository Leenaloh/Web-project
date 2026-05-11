import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { throwError, of } from 'rxjs';

import { CartComponent } from './cart';
import { AuthService } from '../../services/authService/authService';
import { CartService, CartState } from '../../services/cartService/cartService';
import { MoviesService } from '../../services/movieService/movieService';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockMoviesService: jasmine.SpyObj<MoviesService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const rawCart: CartState = {
    items: [
      { movieId: 'tt001', quantity: 2, unitPrice: 10, subtotal: 20 },
      { movieId: 'tt002', quantity: 1, unitPrice: 25, subtotal: 25 }
    ]
  };

  beforeEach(async () => {
    localStorage.setItem('customerId', '1');

    mockCartService = jasmine.createSpyObj('CartService', [
      'getCart',
      'updateItemQuantity',
      'removeItem',
      'removeCartItem',
      'clearCart'
    ]);

    mockMoviesService = jasmine.createSpyObj('MoviesService', ['getMovieById']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['me', 'logout']);
    mockAuthService.me.and.returnValue(of({ status: 'SUCCESS' }));
    mockAuthService.logout.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [CartComponent, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: MoviesService, useValue: mockMoviesService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('loads cart items and enriches them with movie details', () => {
    mockCartService.getCart.and.returnValue(of(rawCart));

    mockMoviesService.getMovieById.withArgs('tt001').and.returnValue(
      of({
        id: 'tt001',
        title: 'The Shawshank Redemption',
        year: 1994,
        director: 'Frank Darabont'
      })
    );

    mockMoviesService.getMovieById.withArgs('tt002').and.returnValue(
      of({
        id: 'tt002',
        title: 'The Wandering Soap Opera',
        year: 2017,
        director: 'Raul Ruiz'
      })
    );

    fixture.detectChanges();

    expect(mockCartService.getCart).toHaveBeenCalledWith();
    expect(mockMoviesService.getMovieById).toHaveBeenCalledWith('tt001');
    expect(mockMoviesService.getMovieById).toHaveBeenCalledWith('tt002');
    expect(component.cartItems[0].title).toBe('The Shawshank Redemption');
    expect(component.totalItems).toBe(3);
    expect(component.totalPrice).toBe(45);
  });

  it('falls back to movieId when the movie details request fails', () => {
    mockCartService.getCart.and.returnValue(
      of({
        items: [{ movieId: 'tt404', quantity: 1 }]
      })
    );

    mockMoviesService.getMovieById.and.returnValue(
      throwError(() => new Error('movie lookup failed'))
    );

    fixture.detectChanges();

    expect(component.cartItems[0].title).toBe('tt404');
    expect(component.totalPrice).toBe(0);
  });

  it('updates quantity and re-enriches the cart', () => {
    mockCartService.getCart.and.returnValue(of(rawCart));

    mockMoviesService.getMovieById.and.returnValues(
      of({ id: 'tt001', title: 'The Shawshank Redemption' }),
      of({ id: 'tt002', title: 'The Wandering Soap Opera' }),
      of({ id: 'tt001', title: 'The Shawshank Redemption' }),
      of({ id: 'tt002', title: 'The Wandering Soap Opera' })
    );

    mockCartService.updateItemQuantity.and.returnValue(
      of({
        items: [
          { movieId: 'tt001', quantity: 3, unitPrice: 10, subtotal: 30 },
          { movieId: 'tt002', quantity: 1, unitPrice: 25, subtotal: 25 }
        ]
      })
    );

    fixture.detectChanges();

    component.increase(component.cartItems[0]);

    expect(mockCartService.updateItemQuantity).toHaveBeenCalledWith('tt001', 3);
    expect(component.cartItems[0].quantity).toBe(3);
    expect(component.totalPrice).toBe(55);
  });

  it('clears the cart', () => {
    mockCartService.getCart.and.returnValues(
      of(rawCart),
      of({ items: [] })
    );

    mockMoviesService.getMovieById.and.returnValues(
      of({ id: 'tt001', title: 'The Shawshank Redemption' }),
      of({ id: 'tt002', title: 'The Wandering Soap Opera' })
    );

    mockCartService.clearCart.and.returnValue(of({ items: [] }));

    fixture.detectChanges();

    component.clear();

    expect(mockCartService.clearCart).toHaveBeenCalled();
    expect(component.cartItems.length).toBe(0);
    expect(component.isEmpty).toBeTrue();
  });

  it('navigates to checkout when the cart has items', () => {
    mockCartService.getCart.and.returnValue(of(rawCart));

    mockMoviesService.getMovieById.and.returnValues(
      of({ id: 'tt001', title: 'The Shawshank Redemption' }),
      of({ id: 'tt002', title: 'The Wandering Soap Opera' })
    );

    fixture.detectChanges();

    const navigateSpy = spyOn(router, 'navigate');

    component.goToCheckout();

    expect(navigateSpy).toHaveBeenCalledWith(['/checkout']);
  });
});
