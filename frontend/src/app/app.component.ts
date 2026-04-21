import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './services/authService/authService';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  get showNavbar(): boolean {
    return this.router.url !== '/' && this.router.url !== '';
  }

  logout(): void {
    this.authService.logout().subscribe({
      error: (err: unknown) => {
        console.error('Logout request failed', err);
      }
    });
  }
}
