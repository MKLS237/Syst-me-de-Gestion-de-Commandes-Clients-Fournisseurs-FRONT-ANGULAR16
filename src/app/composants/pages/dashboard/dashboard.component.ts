import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  navItems = [
    { label: 'Vue globale', route: '/statistiques', icon: 'bi bi-speedometer2' },
    { label: 'Clients', route: '/clients', icon: 'bi bi-people' },
    { label: 'Commandes', route: '/commandes', icon: 'bi bi-cart-check' },
    { label: 'Factures', route: '/factures', icon: 'bi bi-receipt' },
    { label: 'Fournisseurs', route: '/fournisseur', icon: 'bi bi-truck' }
  ];

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
