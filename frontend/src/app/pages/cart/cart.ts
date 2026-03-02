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

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (cartData) => {
        this.cart = cartData;
      },
      error: (err) => {
        console.error('Failed to load cart', err);
        this.cart = { ...DEMO_CART, items: [...DEMO_CART.items] };
      }
    });
  }

  remove(movieId: string): void {
    if (!movieId) return;

    this.cartService.removeItem(movieId).subscribe({
      next: (updatedCart) => {
        this.cart = updatedCart;
      },
      error: (err) => {
        console.error('Failed to remove item', err);
        this.cart = {
          ...this.cart,
          items: this.cart.items.filter((item) => item.movieId !== movieId)
        };
      }
    });
  }

  clear(): void {
    this.cartService.clearCart().subscribe({
      next: (emptyCart) => {
        this.cart = emptyCart;
      },
      error: (err) => {
        console.error('Failed to clear cart', err);
        this.cart = { items: [], totalPrice: 0 };
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
        }
      },
      error: (err) => {
        console.error('Checkout failed', err);
      }
    });
  }
}
