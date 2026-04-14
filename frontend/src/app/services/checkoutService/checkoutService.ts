import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CheckoutRequest {
  customerId: number;
  creditCardId: string;
  firstName: string;
  lastName: string;
  expiration: string;
}

export interface CheckoutResponse {
  message: string;
  customerId: number;
  rentedMoviesCount: number;
  totalAmount: number;
  saleDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly baseUrl = 'http://localhost:8080/api/checkout';

  constructor(private http: HttpClient) {}

  submitCheckout(request: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(this.baseUrl, request);
  }
}