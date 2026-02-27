import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private readonly base = '/api/v1/cart';

  constructor(private http: HttpClient) {}

  getCart(): Observable<CartState> {
    return this.http.get<CartState>(this.base, { withCredentials: true });
  }

  addItem(movieId: string, quantity = 1): Observable<CartState> {
    const params = new HttpParams()
      .set('movieId', movieId)
      .set('quantity', String(quantity));

    return this.http.post<CartState>(`${this.base}/items`, null, {
      params,
      withCredentials: true
    });
  }

  updateItemQuantity(movieId: string, quantity: number): Observable<CartState> {
    const params = new HttpParams()
      .set('movieId', movieId)
      .set('quantity', String(quantity));

    return this.http.put<CartState>(`${this.base}/items`, null, {
      params,
      withCredentials: true
    });
  }

  removeItem(movieId: string): Observable<CartState> {
    return this.http.delete<CartState>(`${this.base}/items/${encodeURIComponent(movieId)}`, {
      withCredentials: true
    });
  }

  clearCart(): Observable<CartState> {
    return this.http.delete<CartState>(this.base, { withCredentials: true });
  }

  checkout(body: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.base}/checkout`, body, {
      withCredentials: true
    });
  }
}