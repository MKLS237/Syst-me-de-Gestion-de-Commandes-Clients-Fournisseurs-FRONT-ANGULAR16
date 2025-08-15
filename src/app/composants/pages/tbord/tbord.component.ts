import { Component, OnInit } from '@angular/core';
import { Statistiques } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client-service.service';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-tbord',
  templateUrl: './tbord.component.html',
  styleUrls: ['./tbord.component.scss']
})
export class TbordComponent implements OnInit, AfterViewInit  {
  stats: any[] = [];
  deliveryPercent = 0;
  statData: Statistiques | null = null;

  // Ajouts pour éviter les erreurs dans le template
  bestClients = [
    { name: 'Client A', total: 800 },
    { name: 'Client B', total: 600 }
  ];
  livraisonStats = {
    livraisonsEffectuees: 0,
    livraisonsNonEffectuees: 0
  };

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.clientService.getStats().subscribe(data => {
      this.statData = data;

      this.stats = [
        { title: 'COMMANDES', value: data.nombreCommandes, icon: 'bi bi-box' },
        { title: 'CLIENTS', value: data.nombreClients, icon: 'bi bi-person' },
        { title: 'LIVRAISONS', value: data.nombreCommandesLivrees, icon: 'bi bi-truck' },
        { title: 'FACTURES', value: data.nombreFactures, icon: 'bi bi-file-earmark-text' },
        { title: 'FACTURES NON PAYÉES', value: data.montantFacturesNonPayees, icon: 'bi bi-cash' }
      ];

      const totalLivraisons = data.nombreCommandes;
      const livrees = data.nombreCommandesLivrees;
      const nonLivrees = data.nombreCommandesNonLivrees;

      this.deliveryPercent = totalLivraisons > 0
        ? Math.round((livrees / totalLivraisons) * 100)
        : 0;

      // Pour le graphique Doughnut
      this.livraisonStats.livraisonsEffectuees = livrees;
      this.livraisonStats.livraisonsNonEffectuees = nonLivrees;

      // Lancer les graphiques après récupération
      this.renderBarChart();
      this.renderLineChart();
      this.renderDoughnutChart();
    });
  }

  get circumference() {
    return 2 * Math.PI * 50;
  }

  renderBarChart(): void {
    const canvas: any = document.getElementById('barChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new (window as any).Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai','Juin', 'juillet', 'Aout', 'sept', 'Oct'],
        datasets: [{
          label: 'Ventes',
          data: [3000, 2000, 1500, 4000, 2800,3000, 2000, 1500, 4000, 2800],
          backgroundColor: '#ff5722'
        }]
      }
    });
  }

  renderLineChart(): void {
    const canvas: any = document.getElementById('lineChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new (window as any).Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai','Juin', 'juillet', 'Aout', 'sept', 'Oct','Nov', 'Dec'],
        datasets: [
          {
            label: 'Commandes',
            data: [2, 5, 8, 6, 10, 12,2, 5, 8, 6, 18, 12, 10, 12],
            borderColor: '#007bff',
            fill: false
          },
          {
            label: 'Factures',
            data: [1, 4, 6, 3, 9, 11,2, 15, 8, 10, 15, 17,, 19, 22],
            borderColor: '#28a745',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Évolution Commandes / Factures (2024)' }
        }
      }
    });
  }

  renderDoughnutChart(): void {
    const canvas: any = document.getElementById('doughnutChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new (window as any).Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Livraisons effectuées', 'Livraisons non effectuées'],
        datasets: [{
          data: [
            this.livraisonStats.livraisonsEffectuees,
            this.livraisonStats.livraisonsNonEffectuees
          ],
          backgroundColor: ['#28a745', '#dc3545'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
  ngAfterViewInit(): void {
  setTimeout(() => {
    this.renderBarChart();
    this.renderLineChart();
    this.renderDoughnutChart();
  }, 100); // Attends que le DOM charge
}
}
