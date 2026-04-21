import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface CartItem {
  cartItemId?: number;
  movieId: string;
  title?: string;
  year?: number;
  director?: string;
  rentalPrice?: number;
  quantity?: number;
  unitPrice?: number;
  subtotal?: number;
}

export interface CartState {
  customerId?: number;
  items: CartItem[];
  totalItems?: number;
  totalAmount?: number;
  totalPrice?: number;
  empty?: boolean;
}

export interface CheckoutRequest {
  customerId?: number;
  creditCardId?: string;
  firstName?: string;
  lastName?: string;
  expiration?: string;
  customerName?: string;
  customerFirstName?: string;
  customerLastName?: string;
}

export interface CheckoutResponse {
  success?: boolean;
  message: string;
  orderId?: string;
  totalPaid?: number;
  customerId?: number;
  rentedMoviesCount?: number;
  totalAmount?: number;
  saleDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly baseUrl = `${environment.apiUrl}/api/v1/cart`;
  private readonly requestOptions = { withCredentials: true };
  private movieTitles: Record<string, string> = {};
  private cartItemIdsByMovieId: Record<string, number> = {};
  private movieIdsByCartItemId: Record<number, string> = {};
  private nextCartItemId = 1;

  constructor(private http: HttpClient) {}

  getCart(_customerId?: number): Observable<CartState> {
    return this.http
      .get<CartState>(this.baseUrl, this.requestOptions)
      .pipe(map((cart) => this.normalizeCartState(cart)));
  }

  addItem(movieId: string, quantity: number): Observable<CartState> {
    return this.http
      .post<CartState>(
        `${this.baseUrl}/items${this.buildItemQuery(movieId, quantity)}`,
        {},
        this.requestOptions
      )
      .pipe(map((cart) => this.normalizeCartState(cart)));
  }

  updateItemQuantity(movieId: string, quantity: number): Observable<CartState> {
    return this.http
      .put<CartState>(
        `${this.baseUrl}/items${this.buildItemQuery(movieId, quantity)}`,
        {},
        this.requestOptions
      )
      .pipe(map((cart) => this.normalizeCartState(cart)));
  }

  removeItem(movieId: string): Observable<CartState> {
    return this.http
      .delete<CartState>(`${this.baseUrl}/items/${encodeURIComponent(movieId)}`, this.requestOptions)
      .pipe(map((cart) => this.normalizeCartState(cart)));
  }

  removeCartItem(_customerId: number, cartItemId: number): Observable<CartState> {
    const movieId = this.movieIdsByCartItemId[cartItemId];

    if (!movieId) {
      return throwError(() => new Error(`Unable to resolve movieId for cart item ${cartItemId}.`));
    }

    return this.removeItem(movieId);
  }

  clearCart(): Observable<CartState> {
    return this.http
      .delete<CartState>(this.baseUrl, this.requestOptions)
      .pipe(map((cart) => this.normalizeCartState(cart)));
  }

  checkout(request: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(
      `${this.baseUrl}/checkout`,
      request,
      this.requestOptions
    );
  }

  rememberMovieTitle(movieId: string, title: string): void {
    if (!movieId || !title) {
      return;
    }

    this.movieTitles[movieId] = title;
  }

  getRememberedMovieTitle(movieId: string): string | undefined {
    return this.movieTitles[movieId];
  }

  private buildItemQuery(movieId: string, quantity: number): string {
    return `?movieId=${encodeURIComponent(movieId)}&quantity=${quantity}`;
  }

  private normalizeCartState(cart: CartState): CartState {
    const nextCartItemIdsByMovieId: Record<string, number> = {};
    const nextMovieIdsByCartItemId: Record<number, string> = {};

    const items = (cart.items ?? []).map((item) =>
      this.normalizeCartItem(item, nextCartItemIdsByMovieId, nextMovieIdsByCartItemId)
    );

    this.cartItemIdsByMovieId = nextCartItemIdsByMovieId;
    this.movieIdsByCartItemId = nextMovieIdsByCartItemId;

    const totalItems =
      cart.totalItems ?? items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
    const totalAmount =
      cart.totalAmount ??
      cart.totalPrice ??
      items.reduce((sum, item) => sum + (item.subtotal ?? 0), 0);

    return {
      ...cart,
      items,
      totalItems,
      totalAmount,
      totalPrice: cart.totalPrice ?? totalAmount,
      empty: cart.empty ?? items.length === 0
    };
  }

  private normalizeCartItem(
    item: CartItem,
    nextCartItemIdsByMovieId: Record<string, number>,
    nextMovieIdsByCartItemId: Record<number, string>
  ): CartItem {
    const movieId = item.movieId;
    const cartItemId = item.cartItemId ?? this.getOrCreateCartItemId(movieId);
    const quantity = item.quantity ?? 1;
    const unitPrice = item.unitPrice ?? item.rentalPrice ?? 0;
    const subtotal = item.subtotal ?? unitPrice * quantity;
    const title = item.title ?? this.getRememberedMovieTitle(movieId) ?? movieId;

    if (title) {
      this.rememberMovieTitle(movieId, title);
    }

    nextCartItemIdsByMovieId[movieId] = cartItemId;
    nextMovieIdsByCartItemId[cartItemId] = movieId;
    this.nextCartItemId = Math.max(this.nextCartItemId, cartItemId + 1);

    return {
      ...item,
      cartItemId,
      title,
      quantity,
      unitPrice,
      rentalPrice: item.rentalPrice ?? unitPrice,
      subtotal
    };
  }

  private getOrCreateCartItemId(movieId: string): number {
    const existingCartItemId = this.cartItemIdsByMovieId[movieId];

    if (existingCartItemId) {
      return existingCartItemId;
    }

    const cartItemId = this.nextCartItemId;
    this.nextCartItemId += 1;
    return cartItemId;
  }
}
