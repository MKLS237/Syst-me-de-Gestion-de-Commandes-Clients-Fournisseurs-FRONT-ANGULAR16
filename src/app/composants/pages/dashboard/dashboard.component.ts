import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  ngOnInit(): void {
      this.renderChart();
  }
  
    stats = [
    { title: 'COMMANDES', value: 11, icon: 'bi bi-box' },
    { title: 'CLIENTS', value: 16, icon: 'bi bi-person' },
    { title: 'LIVRAISONS', value: 5, icon: 'bi bi-truck' },
    { title: 'PRODUITS', value: 8, icon: 'bi bi-bag' },
    { title: 'FACTURES', value: 5, icon: 'bi bi-file-earmark-text' }
  ];

  deliveryPercent = 61;

  bestClients = [
    { name: 'alouli rachid', total: 858 },
    { name: 'boulidam abdell...', total: 858 }
  ];

  lowStock = [
    { name: 'MacBook', quantity: 20 },
    { name: 'Apple AirPods Pro', quantity: 15 },
    { name: 'HP PRO', quantity: 12 }
  ];

 activeMenu = '';
 

  setActive(menu: string) {
    this.activeMenu = menu;
  }
  renderChart(): void {
    const canvas: any = document.getElementById('barChart');
    const ctx = canvas.getContext('2d');

    new (window as any).Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['6', '5', '4', '3', '2'],
        datasets: [{
          label: '2024',
          data: [7000, 3000, 1000, 1000, 800],
          backgroundColor: '#ff5722'
        }]
      }
    });
  }

  get circumference() {
    return 2 * Math.PI * 50;
  }
}
