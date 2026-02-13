import { Routes } from '@angular/router';
import { LebenslaufComponent } from './components/lebenslauf.component';
import { SonstigesComponent } from './components/sonstiges.component';
import { ProjektenComponent } from './components/projekten.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'lebenslauf', pathMatch: 'full' },
  { path: 'lebenslauf', component: LebenslaufComponent, canActivate: [authGuard] },
  { path: 'sonstiges', component: SonstigesComponent, canActivate: [authGuard] },
  { path: 'projekten', component: ProjektenComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'lebenslauf' }
];