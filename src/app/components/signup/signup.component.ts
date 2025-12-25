import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSignup() {
    console.log('=== SIGNUP CLICKED ===');
    console.log('Username:', this.username);
    console.log('Email:', this.email);
    console.log('Password:', this.password ? 'PROVIDED' : 'EMPTY');

    if (!this.username || !this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.auth.signup(this.username, this.email, this.password).subscribe({
      next: (response) => {
        console.log('✅ SIGNUP SUCCESS:', response);
        this.success = 'Account created successfully!';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (err) => {
        console.error('❌ SIGNUP ERROR');
        console.error('Status:', err.status);
        console.error('Status Text:', err.statusText);
        console.error('Error Body:', err.error);
        console.error('Full Error:', err);
        
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else if (err.error && typeof err.error === 'string') {
          this.error = err.error;
        } else if (err.message) {
          this.error = err.message;
        } else {
          this.error = `Signup failed (Status: ${err.status})`;
        }
      }
    });
  }
}