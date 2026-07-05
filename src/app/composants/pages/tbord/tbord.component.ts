import { Component, OnDestroy, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Statistiques } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client-service.service';
import { CommandeService } from 'src/app/services/commande.service';
import { FactureService } from 'src/app/services/facture-service.service';

@Component({
  selector: 'app-tbord',
  templateUrl: './tbord.component.html',
  styleUrls: ['./tbord.component.scss']
})
export class TbordComponent implements OnInit, OnDestroy {
  stats: any[] = [];
  deliveryPercent = 0;
  statData: Statistiques | null = null;
  isLoading = true;
  hasError = false;

  bestClients = [
    { name: 'Client A', total: 800 },
    { name: 'Client B', total: 600 }
  ];

  livraisonStats = {
    livraisonsEffectuees: 0,
    livraisonsNonEffectuees: 0
  };

  private barChart?: Chart<any, any, any>;
  private lineChart?: Chart<any, any, any>;
  private doughnutChart?: Chart<any, any, any>;

  constructor(
    private clientService: ClientService,
    private commandeService: CommandeService,
    private factureService: FactureService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.barChart?.destroy();
    this.lineChart?.destroy();
    this.doughnutChart?.destroy();
  }

  loadStats(): void {
    this.isLoading = true;
    this.hasError = false;

    this.clientService.getStats().subscribe({
      next: data => {
        this.statData = data;
        this.stats = [
          { title: 'Commandes', value: data.nombreCommandes, icon: 'bi bi-box' },
          { title: 'Clients', value: data.nombreClients, icon: 'bi bi-person' },
          { title: 'Livraisons', value: data.nombreCommandesLivrees, icon: 'bi bi-truck' },
          { title: 'Factures', value: data.nombreFactures, icon: 'bi bi-file-earmark-text' },
          { title: 'Impayés', value: data.montantFacturesNonPayees, icon: 'bi bi-cash' }
        ];

        const totalLivraisons = data.nombreCommandes;
        const livrees = data.nombreCommandesLivrees;
        const nonLivrees = data.nombreCommandesNonLivrees;

        this.deliveryPercent = totalLivraisons > 0
          ? Math.round((livrees / totalLivraisons) * 100)
          : 0;

        this.livraisonStats.livraisonsEffectuees = livrees;
        this.livraisonStats.livraisonsNonEffectuees = nonLivrees;
        this.renderDoughnutChart();
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });

    this.loadVentesChart();
    this.loadCommandesFacturesChart();
  }

  get circumference(): number {
    return 2 * Math.PI * 50;
  }

  loadVentesChart(): void {
    this.commandeService.getStats('2025-01-01', '2027-12-31').subscribe(data => {
      const statsParJour = data?.statsParJour ?? [];
      const labels = statsParJour.map((s: any) => s.dateCommande);
      const ventes = statsParJour.map((s: any) => s.totalVentes);

      this.renderBarChart(labels, ventes);
    });
  }

  loadCommandesFacturesChart(): void {
    this.commandeService.getStats('2025-01-01', '2027-12-31').subscribe(cmdStats => {
      this.factureService.getGlobalStats().subscribe(factStats => {
        const statsParJour = cmdStats?.statsParJour ?? [];
        const labels = statsParJour.map((s: any) => s.dateCommande);
        const commandes = statsParJour.map((s: any) => s.totalVentes);
        const factures = Array(labels.length).fill(factStats?.nombreTotal ?? 0);

        this.renderLineChart(labels, commandes, factures);
      });
    });
  }

  renderBarChart(labels: string[], ventes: number[]): void {
    const ctx = this.getChartContext('barChart');
    if (!ctx) return;

    this.barChart?.destroy();
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Total ventes',
          data: ventes,
          backgroundColor: '#2563eb',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  renderLineChart(labels: string[], commandes: number[], factures: number[]): void {
    const ctx = this.getChartContext('lineChart');
    if (!ctx) return;

    this.lineChart?.destroy();
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Commandes',
            data: commandes,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.12)',
            tension: 0.35,
            fill: true
          },
          {
            label: 'Factures',
            data: factures,
            borderColor: '#22c55e',
            tension: 0.35,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }

  renderDoughnutChart(): void {
    const ctx = this.getChartContext('doughnutChart');
    if (!ctx) return;

    this.doughnutChart?.destroy();
    this.doughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Livraisons effectuées', 'Livraisons non effectuées'],
        datasets: [{
          data: [
            this.livraisonStats.livraisonsEffectuees,
            this.livraisonStats.livraisonsNonEffectuees
          ],
          backgroundColor: ['#22c55e', '#ef4444'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  private getChartContext(id: string): CanvasRenderingContext2D | null {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    return canvas?.getContext('2d') ?? null;
  }
}
