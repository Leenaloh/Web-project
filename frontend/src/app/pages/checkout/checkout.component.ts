import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { CartService, CartState } from '../../services/cartService/cartService';
import {
  CheckoutService,
  CheckoutRequest,
  CheckoutResponse
} from '../../services/checkoutService/checkoutService';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  private readonly customerId = 1;

  cart: CartState = {
    customerId: this.customerId,
    items: [],
    totalItems: 0,
    totalAmount: 0,
    empty: true
  };

  checkoutForm: FormGroup;
  loading = false;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.checkoutForm = this.fb.group({
      creditCardId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      expiration: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.errorMessage = '';

    this.cartService.getCart(this.customerId).subscribe({
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

    this.checkoutService.submitCheckout(request).subscribe({
      next: (response: CheckoutResponse) => {
        this.submitting = false;
        this.router.navigate(['/checkout/result'], {
          queryParams: {
            message: response.message,
            customerId: response.customerId,
            rentedMoviesCount: response.rentedMoviesCount,
            totalAmount: response.totalAmount,
            saleDate: response.saleDate
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