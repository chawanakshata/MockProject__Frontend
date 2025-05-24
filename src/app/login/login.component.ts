import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginData = { username: '', password: '' };
  signupData = { username: '', password: '' };
  isLoading = false;
  errorMessage = '';
  passwordErrorMessage = '';
  signUpErrorMessage = '';
  signUpPasswordErrorMessage = '';
  showSignup = false;
  hidePassword = true;
  
  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  isNullOrWhitespace(str: string): boolean {
    return !str || str.trim().length === 0;
  }

  // Login method
onSubmit() {
  this.errorMessage = '';
  this.passwordErrorMessage = '';

  // Both fields empty
  if (this.isNullOrWhitespace(this.loginData.username) && this.isNullOrWhitespace(this.loginData.password)) {
    this.errorMessage = 'Enter username';
    this.passwordErrorMessage = 'Enter password';
    return;
  }

  // Username empty
  if (this.isNullOrWhitespace(this.loginData.username)) {
    this.errorMessage = 'Enter username';
    return;
  }

  // Password empty
  if (this.isNullOrWhitespace(this.loginData.password)) {
    this.passwordErrorMessage = 'Enter password';
    return;
  }

  // Both fields filled, proceed
  this.isLoading = true;
  this.errorMessage = '';
  this.passwordErrorMessage = '';

  this.http.post('https://localhost:7085/api/Login/authenticate', this.loginData)
    .subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.router.navigate(['/user-list']);
        sessionStorage.setItem('username', this.loginData.username);
        sessionStorage.setItem('userRole', res.role);
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err?.error?.message || 'Invalid username or password.';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000, // Snackbar will be visible for 3 seconds
          verticalPosition: 'bottom', // Position at the bottom
          horizontalPosition: 'center', // Center horizontally
          panelClass: ['error-snackbar'] // Optional: Add a custom class for styling
        });
      }
    });
}


  // Signup method
  onSignup() {
  this.signUpErrorMessage = '';
  this.signUpPasswordErrorMessage = '';

  // Both fields empty
  if (this.isNullOrWhitespace(this.signupData.username) && this.isNullOrWhitespace(this.signupData.password)) {
    this.signUpErrorMessage = 'Enter username';
    this.signUpPasswordErrorMessage = 'Enter password';
    return;
  }

  // Username empty
  if (this.isNullOrWhitespace(this.signupData.username)) {
    this.signUpErrorMessage = 'Enter username';
    return;
  }

  // Password empty
  if (this.isNullOrWhitespace(this.signupData.password)) {
    this.signUpPasswordErrorMessage = 'Enter password';
    return;
  }

  // Both fields filled, proceed
  this.isLoading = true;
  this.http.post('https://localhost:7085/api/Login', this.signupData)
    .subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.signUpErrorMessage = res.message || 'Signup successful!';
        this.showSignup = false;
        sessionStorage.setItem('username', this.signupData.username);
        this.snackBar.open('Registration successful!', 'Close', {
          duration: 3000, // Snackbar will be visible for 3 seconds
          verticalPosition: 'bottom', // Position at the bottom
          horizontalPosition: 'center', // Center horizontally
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.signUpErrorMessage = err?.error?.message || 'Signup failed. Please try again.';
      }
    });
}
  
}
