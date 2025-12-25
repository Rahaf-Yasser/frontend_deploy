import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = '/api/auth';

  constructor(private http: HttpClient) {}

  signup(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/signup`, {
      username,
      email,
      password,
      role: 'Organizer'
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/login`, { email, password });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  saveUserId(userId: string) {
    localStorage.setItem('userId', userId);
  }
}
