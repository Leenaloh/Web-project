import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type CartItem = { id: string; title: string; qty: number };

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class CartComponent {
  items: CartItem[] = [
    { id: 'tt001', title: 'The Shawshank Redemption', qty: 2 },
    { id: 'tt002', title: 'The Godfather', qty: 1 },
  ];

  remove(id: string): void {
    this.items = this.items.filter(x => x.id !== id);
  }

  clear(): void {
    this.items = [];
  }

  checkout(): void {
    alert('Proceed to checkout (UI only)');
  }
}