import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItem {
  cartItemId: number;
  movieId: string;
  title: string;
  year: number;
  director: string;
  rentalPrice: number;
}

export interface CartState {
  customerId: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  empty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly baseUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) {}

  getCart(customerId: number): Observable<CartState> {
    return this.http.get<CartState>(`${this.baseUrl}?customerId=${customerId}`);
  }

  addItem(movieId: string, quantity: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/items`, {
      customerId: 1,
      movieId,
      quantity
    });
  }

  rememberMovieTitle(movieId: string, title: string): void {
    localStorage.setItem(`movie_title_${movieId}`, title);
  }

  removeCartItem(customerId: number, cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items/${cartItemId}?customerId=${customerId}`);
  }
}