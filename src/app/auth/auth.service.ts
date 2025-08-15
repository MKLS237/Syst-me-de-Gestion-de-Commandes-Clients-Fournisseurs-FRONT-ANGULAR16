import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'basicAuthToken';

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username && password) {
      const token = btoa(`${username}:${password}`);
      localStorage.setItem(this.STORAGE_KEY, token);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }
}
