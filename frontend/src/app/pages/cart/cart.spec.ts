import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { throwError, of } from 'rxjs';

import { CartComponent } from './cart';
import { CartService, CartState } from '../../services/cartService/cartService';
import { MoviesService } from '../../services/movieService/movieService';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockMoviesService: jasmine.SpyObj<MoviesService>;
  let router: Router;

  const rawCart: CartState = {
    items: [
      { movieId: 'tt001', quantity: 2 },
      { movieId: 'tt002', quantity: 1 }
    ]
  };

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', [
      'getCart',
      'updateItemQuantity',
      'removeItem',
      'clearCart'
    ]);

    mockMoviesService = jasmine.createSpyObj('MoviesService', ['getMovieById']);

    await TestBed.configureTestingModule({
      imports: [CartComponent, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: MoviesService, useValue: mockMoviesService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('loads cart items and enriches them with movie details', () => {
    mockCartService.getCart.and.returnValue(of(rawCart));
    mockMoviesService.getMovieById.withArgs('tt001').and.returnValue(
      of({
        id: 'tt001',
        title: 'The Shawshank Redemption',
        year: 1994,
        director: 'Frank Darabont',
        price: 10
      })
    );
    mockMoviesService.getMovieById.withArgs('tt002').and.returnValue(
      of({
        id: 'tt002',
        title: 'The Wandering Soap Opera',
        year: 2017,
        director: 'Raul Ruiz',
        rentalPrice: 25
      })
    );

    fixture.detectChanges();

    expect(mockCartService.getCart).toHaveBeenCalledWith(1);
    expect(mockMoviesService.getMovieById).toHaveBeenCalledWith('tt001');
    expect(mockMoviesService.getMovieById).toHaveBeenCalledWith('tt002');
    expect(component.cartItems[0].title).toBe('The Shawshank Redemption');
    expect(component.totalItems).toBe(3);
    expect(component.totalPrice).toBe(45);
  });

  it('falls back to movieId when the movie details request fails', () => {
    mockCartService.getCart.and.returnValue(of({ items: [{ movieId: 'tt404', quantity: 1 }] }));
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
      of({ id: 'tt001', title: 'The Shawshank Redemption', price: 10 }),
      of({ id: 'tt002', title: 'The Wandering Soap Opera', price: 25 }),
      of({ id: 'tt001', title: 'The Shawshank Redemption', price: 10 }),
      of({ id: 'tt002', title: 'The Wandering Soap Opera', price: 25 })
    );
    mockCartService.updateItemQuantity.and.returnValue(
      of({
        items: [
          { movieId: 'tt001', quantity: 3 },
          { movieId: 'tt002', quantity: 1 }
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
    mockCartService.getCart.and.returnValue(of(rawCart));
    mockMoviesService.getMovieById.and.returnValues(
      of({ id: 'tt001', title: 'The Shawshank Redemption', price: 10 }),
      of({ id: 'tt002', title: 'The Wandering Soap Opera', price: 25 })
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
      of({ id: 'tt001', title: 'The Shawshank Redemption', price: 10 }),
      of({ id: 'tt002', title: 'The Wandering Soap Opera', price: 25 })
    );

    fixture.detectChanges();

    const navigateSpy = spyOn(router, 'navigate');
    component.goToCheckout();

    expect(navigateSpy).toHaveBeenCalledWith(['/checkout']);
  });
});
