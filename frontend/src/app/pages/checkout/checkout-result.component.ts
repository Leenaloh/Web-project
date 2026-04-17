import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-result',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout-result.component.html',
  styleUrl: './checkout-result.component.css'
})
export class CheckoutResultComponent implements OnInit {
  orderId = '';
  totalAmount = '';
  totalItems = '';
  status = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.orderId = params.get('orderId') || '';
      this.totalAmount = params.get('totalAmount') || '';
      this.totalItems = params.get('totalItems') || '';
      this.status = params.get('status') || 'SUCCESS';
    });
  }
}