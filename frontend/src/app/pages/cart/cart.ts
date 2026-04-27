import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { CartItem, CartService, CartState } from '../../services/cartService/cartService';
import { Movie, MoviesService } from '../../services/movieService/movieService';

interface EnrichedCartItem {
  movieId: string;
  quantity: number;
  title: string;
  year?: number;
  director?: string;
  price: number | null;
}

interface CartViewModel {
  items: EnrichedCartItem[];
  totalItems: number;
  totalPrice: number;
  empty: boolean;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class CartComponent implements OnInit {
  customerId = 0;

  isMenuOpen = false;
  cartItems: EnrichedCartItem[] = [];
  totalItems = 0;
  totalPrice = 0;
  isEmpty = true;
  hasUnavailablePricing = false;
  loading = false;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private moviesService: MoviesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedCustomerId = localStorage.getItem('customerId');

    if (!storedCustomerId) {
      this.router.navigate(['/']);
      return;
    }

    const parsedCustomerId = Number(storedCustomerId);

    if (Number.isNaN(parsedCustomerId) || parsedCustomerId <= 0) {
      localStorage.removeItem('customerId');
      this.router.navigate(['/']);
      return;
    }

    this.customerId = parsedCustomerId;
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.errorMessage = '';

    this.cartService
      .getCart(this.customerId)
      .pipe(switchMap((cartData) => this.enrichCartState(cartData)))
      .subscribe({
        next: (viewModel) => {
          this.applyViewModel(viewModel);
          this.loading = false;
        },
        error: (err: unknown) => {
          console.error('Failed to load cart', err);
          this.errorMessage = 'Failed to load cart.';
          this.loading = false;
        }
      });
  }

  remove(item: EnrichedCartItem): void {
    this.errorMessage = '';

    this.cartService
      .removeItem(item.movieId)
      .pipe(switchMap((cartData) => this.enrichCartState(cartData)))
      .subscribe({
        next: (viewModel) => {
          this.applyViewModel(viewModel);
        },
        error: (err: unknown) => {
          console.error('Failed to remove item', err);
          this.errorMessage = 'Failed to remove item.';
        }
      });
  }

  increase(item: any): void {
  const nextQty = item.quantity + 1;

  this.cartService.updateItemQuantity(item.movieId, nextQty).subscribe({
    next: () => {
      item.quantity = nextQty;
      this.loadCart();
    },
    error: (err) => {
      console.error('Failed to update quantity', err);
      this.errorMessage = 'Failed to update quantity.';
    }
  });
}
  decrease(item: EnrichedCartItem): void {
    if (item.quantity <= 1) {
      this.remove(item);
      return;
    }

    this.updateQuantity(item.movieId, item.quantity - 1);
  }

  clear(): void {
  this.cartService.clearCart().subscribe({
    next: () => {
      this.cartItems = [];
      this.totalPrice = 0;
      this.errorMessage = '';
      this.loadCart();
    },
    error: () => {
      this.errorMessage = 'Failed to clear cart.';
    }
  });
}

  goToCheckout(): void {
    if (this.isEmpty) {
      return;
    }

    this.router.navigate(['/checkout']);
  }

  getItemSubtotal(item: EnrichedCartItem): number {
    return (item.price ?? 0) * item.quantity;
  }

  hasPrice(item: EnrichedCartItem): boolean {
    return item.price !== null;
  }

  private updateQuantity(movieId: string, quantity: number): void {
    this.errorMessage = '';

    this.cartService
      .updateItemQuantity(movieId, quantity)
      .pipe(switchMap((cartData) => this.enrichCartState(cartData)))
      .subscribe({
        next: (viewModel) => {
          this.applyViewModel(viewModel);
        },
        error: (err: unknown) => {
          console.error('Failed to update cart item quantity', err);
          this.errorMessage = 'Failed to update item quantity.';
        }
      });
  }

  private enrichCartState(cartData: CartState): Observable<CartViewModel> {
    const rawItems = cartData.items ?? [];

    if (rawItems.length === 0) {
      return of({
        items: [],
        totalItems: 0,
        totalPrice: 0,
        empty: true
      });
    }

    const itemRequests = rawItems.map((item) =>
      this.moviesService.getMovieById(item.movieId).pipe(
        map((movie) => this.buildEnrichedCartItem(item, movie)),
        catchError((err: unknown) => {
          console.error(`Failed to load movie details for ${item.movieId}`, err);
          return of(this.buildFallbackCartItem(item));
        })
      )
    );

    return forkJoin(itemRequests).pipe(
      map((items) => ({
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: items.reduce((sum, item) => sum + this.getItemSubtotal(item), 0),
        empty: items.length === 0
      }))
    );
  }

  private buildEnrichedCartItem(item: CartItem, movie: Movie): EnrichedCartItem {
    return {
      movieId: item.movieId,
      quantity: item.quantity ?? 1,
      title: movie.title || item.title || item.movieId,
      year: movie.year ?? item.year,
      director: movie.director ?? item.director,
      price: this.resolvePrice(item)
    };
  }

  private buildFallbackCartItem(item: CartItem): EnrichedCartItem {
    return {
      movieId: item.movieId,
      quantity: item.quantity ?? 1,
      title: item.title ?? item.movieId,
      year: item.year,
      director: item.director,
      price: this.resolvePrice(item)
    };
  }

  private resolvePrice(item: CartItem): number | null {
    const quantity = item.quantity ?? 1;
    const candidatePrices = [
      item.unitPrice,
      typeof item.subtotal === 'number' && quantity > 0 ? item.subtotal / quantity : null
    ];

    const knownPrice = candidatePrices.find(
      (price): price is number => typeof price === 'number' && price > 0
    );

    return knownPrice ?? null;
  }

  private applyViewModel(viewModel: CartViewModel): void {
    this.cartItems = viewModel.items;
    this.totalItems = viewModel.totalItems;
    this.totalPrice = viewModel.totalPrice;
    this.isEmpty = viewModel.empty;
    this.hasUnavailablePricing = viewModel.items.some((item) => item.price === null);
  }
}