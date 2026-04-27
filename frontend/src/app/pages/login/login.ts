import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/authService/authService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) {}

  login(): void {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    this.authService.login({ useremail: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS') {
            localStorage.setItem('customerId', String(response.userId));
            this.router.navigate(['/home']);
          }
        },
        error: (err: any) => {
          console.error('Login failed', err);
          if (err.status === 401) {
            this.errorMessage = 'Invalid email or password. Please try again.';
          } else {
            this.errorMessage = 'A server error occurred. Please try again later.';
          }
        }
      });
  }
}