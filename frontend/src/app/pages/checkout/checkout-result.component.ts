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
  totalAmount = 0;
  totalItems = 0;
  status = 'SUCCESS';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.orderId = params.get('orderId') || '';
      this.totalAmount = Number(params.get('totalAmount') || 0);
      this.totalItems = Number(params.get('totalItems') || 0);
      this.status = params.get('status') || 'SUCCESS';
    });
  }
}