import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private authService = inject(AuthService);
  private emailService = inject(EmailService);
  private router = inject(Router);

  // View state
  isRequestingAccess = signal(false);

  // Login form
  username = signal('');
  password = signal('');
  loginError = signal('');

  // Request access form
  requestEmail = signal('');
  isSendingEmail = signal(false);
  emailSentMessage = signal('');
  emailError = signal('');
  
  onLoginSubmit(): void {
    this.loginError.set('');
    const loggedIn = this.authService.login(this.username(), this.password());
    if (loggedIn) {
      this.router.navigate(['/lebenslauf']);
    } else {
      this.loginError.set('Benutzername oder Passwort ungültig.');
    }
  }

  async onRequestAccessSubmit(): Promise<void> {
    if (!this.requestEmail().trim() || this.isSendingEmail()) return;

    this.isSendingEmail.set(true);
    this.emailError.set('');
    this.emailSentMessage.set('');

    try {
      await this.emailService.sendLoginDetails(this.requestEmail());
      this.emailSentMessage.set(`Zugangsdaten wurden an ${this.requestEmail()} gesendet.`);
      this.requestEmail.set('');
      setTimeout(() => this.isRequestingAccess.set(false), 3000);
    } catch (error) {
      this.emailError.set('E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.');
    } finally {
      this.isSendingEmail.set(false);
    }
  }

  toggleView(): void {
    this.isRequestingAccess.update(v => !v);
    this.loginError.set('');
    this.emailError.set('');
    this.emailSentMessage.set('');
  }
}