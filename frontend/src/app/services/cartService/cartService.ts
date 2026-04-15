import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CartState {
  items: Array<{ movieId: string; title?: string; quantity: number; unitPrice?: number }>;
  totalPrice?: number;
}

export interface CheckoutRequest {
  customerName?: string;
  address?: string;
  paymentMethod?: string;
}

export interface CheckoutResponse {
  success: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly base = `${environment.apiUrl}/api/v1/cart`;
  private readonly useMockCartFallback = environment.useMockCartFallback;
  private readonly mockStorageKey = 'mock-cart-state';
  private readonly movieTitleStorageKey = 'movie-title-cache';
  private readonly mockCatalog: Record<string, { title: string; unitPrice: number }> = {
    tt001: { title: 'The Shawshank Redemption', unitPrice: 15 },
    tt002: { title: 'The Wandering Soap Opera', unitPrice: 15 }
  };

  constructor(private http: HttpClient) {}

  rememberMovieTitle(movieId: string, title?: string): void {
    if (!movieId || !title || typeof localStorage === 'undefined') {
      return;
    }

    const cache = this.getMovieTitleCache();
    cache[movieId] = title;
    localStorage.setItem(this.movieTitleStorageKey, JSON.stringify(cache));
  }

  getCart(): Observable<CartState> {
    return this.http.get<CartState>(this.base, { withCredentials: true }).pipe(
      map((cart) => this.hydrateCartTitles(cart)),
      catchError((error) => this.handleMockFallback(error, () => this.getMockCart()))
    );
  }

  addItem(movieId: string, quantity = 1): Observable<CartState> {
    const params = new HttpParams()
      .set('movieId', movieId)
      .set('quantity', String(quantity));

    return this.http.post<CartState>(`${this.base}/items`, null, {
      params,
      withCredentials: true
    }).pipe(
      map((cart) => this.hydrateCartTitles(cart)),
      catchError((error) => this.handleMockFallback(error, () => this.addMockItem(movieId, quantity)))
    );
  }

  updateItemQuantity(movieId: string, quantity: number): Observable<CartState> {
    const params = new HttpParams()
      .set('movieId', movieId)
      .set('quantity', String(quantity));

    return this.http.put<CartState>(`${this.base}/items`, null, {
      params,
      withCredentials: true
    }).pipe(
      map((cart) => this.hydrateCartTitles(cart)),
      catchError((error) =>
        this.handleMockFallback(error, () => this.updateMockItemQuantity(movieId, quantity)))
    );
  }

  removeItem(movieId: string): Observable<CartState> {
    return this.http.delete<CartState>(`${this.base}/items/${encodeURIComponent(movieId)}`, {
      withCredentials: true
    }).pipe(
      map((cart) => this.hydrateCartTitles(cart)),
      catchError((error) => this.handleMockFallback(error, () => this.removeMockItem(movieId)))
    );
  }

  clearCart(): Observable<CartState> {
    return this.http.delete<CartState>(this.base, { withCredentials: true }).pipe(
      map((cart) => this.hydrateCartTitles(cart)),
      catchError((error) => this.handleMockFallback(error, () => this.clearMockCart()))
    );
  }

  checkout(body: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.base}/checkout`, body, {
      withCredentials: true
    }).pipe(
      catchError((error) => this.handleMockFallback(error, () => {
        const cart = this.getMockCart();
        if (!cart.items.length) {
          return { success: false, message: 'Cart is empty' };
        }

        this.clearMockCart();
        return { success: true, message: 'Order placed (mock mode)' };
      }))
    );
  }

  private handleMockFallback<T>(error: unknown, fallback: () => T): Observable<T> {
    if (this.useMockCartFallback) {
      return of(fallback());
    }

    return throwError(() => error);
  }

  private hydrateCartTitles(cart: CartState): CartState {
    const cache = this.getMovieTitleCache();
    return {
      ...cart,
      items: (cart.items ?? []).map((item) => ({
        ...item,
        title: this.resolveTitle(item.movieId, item.title, cache)
      }))
    };
  }

  private resolveTitle(movieId: string, title: string | undefined, cache: Record<string, string>): string {
    if (title && title !== movieId) {
      this.rememberMovieTitle(movieId, title);
      return title;
    }

    return cache[movieId] ?? this.mockCatalog[movieId]?.title ?? title ?? movieId;
  }

  private getMovieTitleCache(): Record<string, string> {
    if (typeof localStorage === 'undefined') {
      return {};
    }

    const raw = localStorage.getItem(this.movieTitleStorageKey);
    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw) as Record<string, string>;
    } catch {
      return {};
    }
  }

  private getMockCart(): CartState {
    if (typeof localStorage === 'undefined') {
      return { items: [], totalPrice: 0 };
    }

    const raw = localStorage.getItem(this.mockStorageKey);
    if (!raw) {
      return this.seedMockCart();
    }

    try {
      return this.normalizeCart(JSON.parse(raw) as CartState);
    } catch {
      return this.seedMockCart();
    }
  }

  private seedMockCart(): CartState {
    const seeded = this.normalizeCart({
      items: [
        { movieId: 'tt001', title: 'The Shawshank Redemption', quantity: 2, unitPrice: 15 },
        { movieId: 'tt002', title: 'The Wandering Soap Opera', quantity: 1, unitPrice: 15 }
      ],
      totalPrice: 45
    });
    this.saveMockCart(seeded);
    return seeded;
  }

  private saveMockCart(cart: CartState): CartState {
    const normalized = this.normalizeCart(cart);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.mockStorageKey, JSON.stringify(normalized));
    }
    return normalized;
  }

  private addMockItem(movieId: string, quantity: number): CartState {
    const cart = this.getMockCart();
    const existing = cart.items.find((item) => item.movieId === movieId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      const movie = this.mockCatalog[movieId];
      cart.items.push({
        movieId,
        title: movie?.title ?? movieId,
        quantity,
        unitPrice: movie?.unitPrice ?? 0
      });
    }

    return this.saveMockCart(cart);
  }

  private updateMockItemQuantity(movieId: string, quantity: number): CartState {
    const cart = this.getMockCart();
    const existing = cart.items.find((item) => item.movieId === movieId);

    if (existing) {
      existing.quantity = quantity;
      return this.saveMockCart(cart);
    }

    return this.addMockItem(movieId, quantity);
  }

  private removeMockItem(movieId: string): CartState {
    const cart = this.getMockCart();
    cart.items = cart.items.filter((item) => item.movieId !== movieId);
    return this.saveMockCart(cart);
  }

  private clearMockCart(): CartState {
    return this.saveMockCart({ items: [], totalPrice: 0 });
  }

  private normalizeCart(cart: CartState): CartState {
    const items = (cart.items ?? []).map((item) => ({
      movieId: item.movieId,
      title: item.title ?? this.mockCatalog[item.movieId]?.title ?? item.movieId,
      quantity: item.quantity,
      unitPrice: item.unitPrice ?? this.mockCatalog[item.movieId]?.unitPrice ?? 0
    }));

    const totalPrice = items.reduce(
      (sum, item) => sum + (item.unitPrice ?? 0) * item.quantity,
      0
    );

    return { items, totalPrice };
  }
}
