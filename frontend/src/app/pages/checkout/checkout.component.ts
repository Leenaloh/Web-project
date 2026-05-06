import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

import {
  CartItem,
  CartService,
  CartState,
  CheckoutRequest,
  CheckoutResponse
} from '../../services/cartService/cartService';
import { Movie, MoviesService } from '../../services/movieService/movieService';

interface CheckoutSummaryItem {
  movieId: string;
  title: string;
  year?: number;
  director?: string;
  quantity: number;
  rentalPrice: number;
  subtotal: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  customerId = 0;

  cart: CartState = {
    customerId: 0,
    items: [],
    totalItems: 0,
    totalAmount: 0,
    empty: true
  };

  summaryItems: CheckoutSummaryItem[] = [];

  checkoutForm: FormGroup;
  loading = false;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private moviesService: MoviesService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      creditCardId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      expiration: ['', Validators.required]
    });
  }

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
    this.cart.customerId = this.customerId;
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.errorMessage = '';

    this.cartService
      .getCart(this.customerId)
      .pipe(switchMap((response: CartState) => this.enrichCheckoutCart(response)))
      .subscribe({
        next: (response: CartState) => {
          this.cart = response;
          this.loading = false;

          if (response.empty) {
            this.router.navigate(['/cart']);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to load checkout data', error);
          this.errorMessage = error.error?.message || 'Failed to load checkout data.';
          this.loading = false;
        }
      });
  }

  private enrichCheckoutCart(cartData: CartState) {
    const rawItems = cartData.items ?? [];

    if (rawItems.length === 0) {
      this.summaryItems = [];
      this.cart = {
        ...cartData,
        totalItems: 0,
        totalAmount: 0,
        empty: true
      };
      return of(this.cart);
    }

    const requests = rawItems.map((item: CartItem) =>
      this.moviesService.getMovieById(item.movieId).pipe(
        map((movie: Movie) => {
          const quantity = item.quantity ?? 1;
          const rentalPrice = item.unitPrice ?? 0;

          return {
            movieId: item.movieId,
            title: movie.title || item.title || item.movieId,
            year: movie.year ?? item.year,
            director: movie.director ?? item.director,
            quantity,
            rentalPrice,
            subtotal: rentalPrice * quantity
          };
        }),
        catchError((err: unknown) => {
          console.error(`Failed to load movie details for ${item.movieId}`, err);

          const quantity = item.quantity ?? 1;
          const rentalPrice = item.unitPrice ?? 0;

          return of({
            movieId: item.movieId,
            title: item.title || item.movieId,
            year: item.year,
            director: item.director,
            quantity,
            rentalPrice,
            subtotal: rentalPrice * quantity
          });
        })
      )
    );

    return forkJoin(requests).pipe(
      map((items: CheckoutSummaryItem[]) => {
        this.summaryItems = items;

        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

        this.cart = {
          ...cartData,
          totalItems,
          totalAmount,
          empty: items.length === 0
        };

        return this.cart;
      })
    );
  }

  submitCheckout(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const formValue = this.checkoutForm.value;

    const request: CheckoutRequest = {
      customerId: this.customerId,
      creditCardId: formValue.creditCardId ?? '',
      firstName: formValue.firstName ?? '',
      lastName: formValue.lastName ?? '',
      expiration: formValue.expiration ?? ''
    };

    this.submitting = true;
    this.errorMessage = '';

    this.cartService.checkout(request).subscribe({
      next: (response: CheckoutResponse) => {
        this.submitting = false;
        this.router.navigate(['/checkout/result'], {
          queryParams: {
            orderId: response.orderId ?? '',
            status: response.success ? 'SUCCESS' : 'FAILED',
            totalItems: this.cart.totalItems ?? 0,
            totalAmount: this.cart.totalAmount ?? 0
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Checkout failed', error);
        this.errorMessage = error.error?.message || 'Checkout failed.';
        this.submitting = false;
      }
    });
  }

  get creditCardId() {
    return this.checkoutForm.get('creditCardId');
  }

  get firstName() {
    return this.checkoutForm.get('firstName');
  }

  get lastName() {
    return this.checkoutForm.get('lastName');
  }

  get expiration() {
    return this.checkoutForm.get('expiration');
  }
}