import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    console.log('=== LOGIN BUTTON CLICKED ===');
    console.log('Email:', this.email);
    console.log('Password:', this.password ? 'PROVIDED' : 'EMPTY');

    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      console.log('❌ Validation failed - empty fields');
      return;
    }

    console.log('Calling auth.login()...');
    
    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('✅ LOGIN SUCCESS');
        console.log('Response:', res);
        console.log('Token:', res.token);
        console.log('UserId:', res.userId);
        
        this.auth.saveToken(res.token);
        
        if (res.userId) {
          this.auth.saveUserId(res.userId.toString());
          console.log('✅ UserId saved to localStorage');
        } else {
          console.warn('⚠️ No userId in response!');
        }
        
        console.log('Navigating to dashboard...');
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('❌ LOGIN ERROR');
        console.error('Status:', err.status);
        console.error('Error:', err);
        console.error('Error message:', err.error);
        this.error = 'Invalid email or password';
      }
    });
  }
}