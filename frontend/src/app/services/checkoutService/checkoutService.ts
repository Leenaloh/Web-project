import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CheckoutRequest {
  customerId: number;
  creditCardId: string;
  firstName: string;
  lastName: string;
  expiration: string;
}

export interface CheckoutResponse {
  orderId: number;
  status: string;
  message: string;
  customerId: number;
  totalItems: number;
  totalAmount: number;
  saleDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly baseUrl = `${environment.apiUrl}/api/checkout`;

  constructor(private http: HttpClient) {}

  submitCheckout(request: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(this.baseUrl, request);
  }
}