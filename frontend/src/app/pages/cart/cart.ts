import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartState } from "../../services/cartService/cartService";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class CartComponent{
  cart: CartState = { 
    items: [
      { movieId: "tt001", title: "The Shawshank Redemption", quantity: 2 },
      { movieId: "tt002", title: "The Wandering Soap Opera", quantity: 1 }
    ],
    totalPrice: 45
  };

  constructor(private cartService: CartService) {}

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (cartData) => {
        this.cart = cartData;
      },
      error: (err) => console.error('Failed to load cart', err)
    });
  }

  remove(movieId: string): void {
    this.cartService.removeItem(movieId).subscribe({
      next: (updatedCart) => {
        this.cart = updatedCart; 
      }
    });
  }

  clear(): void {
    this.cartService.clearCart().subscribe({
      next: (emptyCart) => {
        this.cart = emptyCart;
      }
    });
  }

  checkout(): void {
    const request = { customerName: 'Guest' }; 
    
    this.cartService.checkout(request).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Checkout successful: ' + response.message);
          this.cart = { items: [] };
        }
      }
    });
  }
}


