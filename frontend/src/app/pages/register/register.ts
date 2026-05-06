import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/authService/authService';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  address = '';
  ccId = '';
  expiration = '';

  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.password.trim() ||
      !this.address.trim() ||
      !this.ccId.trim() ||
      !this.expiration.trim()
    ) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    this.authService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      address: this.address,
      ccId: this.ccId,
      expiration: this.expiration
    }).subscribe({
      next: (res) => {
        if (res.status === 'SUCCESS') {
          this.successMessage = 'Registered successfully!';
          setTimeout(() => this.router.navigate(['/']), 1500);
        } else {
          this.errorMessage = res.message || 'Registration failed';
        }
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Registration failed';
      }
    });
  }
}