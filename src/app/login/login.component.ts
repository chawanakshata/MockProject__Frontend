import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { username: '', password: '' };
  signupData = { username: '', password: '' };
  isLoading = false;
  errorMessage = '';
  signupMessage = '';
  showSignup = false;

  constructor(private http: HttpClient, private router: Router) {}

  // Login method
  onSubmit() {
    this.isLoading = true;
    this.http.post('https://localhost:7085/api/Auth/login', this.loginData)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          // Navigate to user-list page on successful login
          this.router.navigate(['/user-list']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.message || 'Invalid username or password.';
        }
      });
  }

  // Signup method
  onSignup() {
    this.isLoading = true;
    this.http.post('https://localhost:7085/api/Auth/signup', this.signupData)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.signupMessage = res.message || 'Signup successful!';
          this.showSignup = false; // Switch back to login form after successful signup
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.message || 'Signup failed. Please try again.';
        }
      });
  }
}
