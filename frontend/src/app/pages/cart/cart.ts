import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartState, CartItem } from '../../services/cartService/cartService';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class CartComponent implements OnInit {
  private readonly customerId = 1;

  cart: CartState = {
    customerId: this.customerId,
    items: [],
    totalItems: 0,
    totalAmount: 0,
    empty: true
  };

  loading = false;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.errorMessage = '';

    this.cartService.getCart(this.customerId).subscribe({
      next: (cartData) => {
        this.cart = cartData;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load cart', err);
        this.errorMessage = 'Failed to load cart.';
        this.loading = false;
      }
    });
  }

  remove(item: CartItem): void {
    if (!item.cartItemId) return;

    this.cartService.removeCartItem(this.customerId, item.cartItemId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => {
        console.error('Failed to remove item', err);
        this.errorMessage = 'Failed to remove item.';
      }
    });
  }

  goToCheckout(): void {
    if (this.cart.empty) return;
    this.router.navigate(['/checkout']);
  }
}
