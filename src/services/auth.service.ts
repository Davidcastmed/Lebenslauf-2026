import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  
  isAuthenticated = signal<boolean>(this.hasValidSession());

  private hasValidSession(): boolean {
    if (typeof sessionStorage === 'undefined') {
        return false;
    }
    return sessionStorage.getItem('is_authenticated') === 'true';
  }

  login(username: string, password_provided: string): boolean {
    if (username === 'Gast' && password_provided === 'KeepItSimple') {
      sessionStorage.setItem('is_authenticated', 'true');
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem('is_authenticated');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
