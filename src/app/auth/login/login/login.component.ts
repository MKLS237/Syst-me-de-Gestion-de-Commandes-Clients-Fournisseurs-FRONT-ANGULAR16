import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';
    const success = this.authService.login(this.username.trim(), this.password.trim());
    if (success) {
      this.router.navigate(['/']);  // redirige vers la page principale
    } else {
      this.error = 'Nom d\'utilisateur et mot de passe requis';
    }
  }
}
