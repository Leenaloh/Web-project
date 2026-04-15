import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartState } from '../../services/cartService/cartService';

const DEMO_CART: CartState = {
  items: [
    { movieId: 'tt001', title: 'The Shawshank Redemption', quantity: 2 },
    { movieId: 'tt002', title: 'The Wandering Soap Opera', quantity: 1 }
  ],
  totalPrice: 45
};

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class CartComponent implements OnInit {
  cart: CartState = { ...DEMO_CART, items: [...DEMO_CART.items] };
  success = '';
  error = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (cartData) => {
        this.cart = cartData;
        this.error = '';
      },
      error: (err) => {
        console.error('Failed to load cart', err);
        this.cart = { ...DEMO_CART, items: [...DEMO_CART.items] };
        this.error = 'Failed to load cart.';
      }
    });
  }

  updateQuantity(movieId: string, quantity: number): void {
    if (!movieId || quantity <= 0) {
      this.error = 'Quantity must be greater than zero.';
      this.success = '';
      return;
    }

    this.cartService.updateItemQuantity(movieId, quantity).subscribe({
      next: (updatedCart) => {
        this.cart = updatedCart;
        this.success = 'Cart updated.';
        this.error = '';
      },
      error: (err) => {
        console.error('Failed to update quantity', err);
        this.error = 'Failed to update quantity.';
        this.success = '';
      }
    });
  }

  increase(itemMovieId: string, currentQuantity: number): void {
    this.updateQuantity(itemMovieId, currentQuantity + 1);
  }

  decrease(itemMovieId: string, currentQuantity: number): void {
    if (currentQuantity <= 1) {
      this.error = 'Quantity must be greater than zero.';
      this.success = '';
      return;
    }

    this.updateQuantity(itemMovieId, currentQuantity - 1);
  }

  remove(movieId: string): void {
    if (!movieId) return;

    this.cartService.removeItem(movieId).subscribe({
      next: (updatedCart) => {
        this.cart = updatedCart;
        this.success = 'Item removed from cart.';
        this.error = '';
      },
      error: (err) => {
        console.error('Failed to remove item', err);
        this.cart = {
          ...this.cart,
          items: this.cart.items.filter((item) => item.movieId !== movieId)
        };
        this.error = 'Failed to remove item.';
        this.success = '';
      }
    });
  }

  clear(): void {
    this.cartService.clearCart().subscribe({
      next: (emptyCart) => {
        this.cart = emptyCart;
        this.success = '';
        this.error = '';
      },
      error: (err) => {
        console.error('Failed to clear cart', err);
        this.cart = { items: [], totalPrice: 0 };
        this.error = 'Failed to clear cart.';
      }
    });
  }

  checkout(): void {
    const request = { customerName: 'Guest' };

    this.cartService.checkout(request).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Checkout successful: ' + response.message);
          this.cart = { items: [], totalPrice: 0 };
          this.success = '';
          this.error = '';
        }
      },
      error: (err) => {
        console.error('Checkout failed', err);
        this.error = 'Checkout failed.';
      }
    });
  }
}
