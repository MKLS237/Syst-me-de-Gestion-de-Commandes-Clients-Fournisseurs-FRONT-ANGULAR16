import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommandeService } from 'src/app/services/commande.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Commande } from 'src/app/models/commande.model';

@Component({
  selector: 'app-commande-stats',
  templateUrl: './commande-stats.component.html',
  styleUrls: ['./commande-stats.component.scss']
})
export class CommandeStatsComponent implements OnInit {
  form: FormGroup;
  stats: any;
  nonLivreesAnciennes: Commande[] = [];

  // --- CHART CONFIGS ---
  barChartType: ChartType = 'bar';
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } }
  };
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { label: 'Total Ventes (F CFA)', data: [], backgroundColor: '#0d6efd' },
      { label: 'Total Coûts (F CFA)', data: [], backgroundColor: '#dc3545' }
    ]
  };

  lineChartType: ChartType = 'line';
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } }
  };
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Bénéfice (F CFA)',
        data: [],
        borderColor: '#198754',
        backgroundColor: '#198754',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false
      }
    ]
  };

  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie'> = {
    labels: ['Bénéfice', 'Coûts'],
    datasets: [{ data: [], backgroundColor: ['#198754', '#dc3545'] }]
  };
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  constructor(private fb: FormBuilder, private commandeService: CommandeService) {
    this.form = this.fb.group({ startDate: [''], endDate: [''] });
  }

  ngOnInit(): void {
    // Définir par défaut la période sur 7 derniers jours
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    this.form.patchValue({
      startDate: this.formatDateISO(sevenDaysAgo),
      endDate: this.formatDateISO(today)
    });

    // Charger les stats immédiatement
    this.rechercherStats();

    // Recharger automatiquement en cas de changement de date
    this.form.valueChanges.subscribe(() => {
      const { startDate, endDate } = this.form.value;
      if (startDate && endDate) {
        this.rechercherStats();
      }
    });
  }

  rechercherStats(): void {
    const { startDate, endDate } = this.form.value;
    if (!startDate || !endDate) return;

    this.commandeService.getStats(startDate, endDate).subscribe({
      next: (res) => {
        this.stats = res;
        this.nonLivreesAnciennes = res.nonLivreesAnciennes || [];
        this.refreshCharts();
      },
      error: (err) => console.error('Erreur lors de la récupération des stats', err)
    });
      if (!this.stats?.statsParJour || this.stats.statsParJour.length === 0) {
    console.warn('Pas de données pour statsParJour.');
    // Réinitialiser les charts à vide si nécessaire
    this.barChartData = {
      labels: [],
      datasets: [
        { label: 'Total Ventes (F CFA)', data: [], backgroundColor: '#0d6efd' },
        { label: 'Total Coûts (F CFA)', data: [], backgroundColor: '#dc3545' }
      ]
    };
    this.lineChartData = {
      labels: [],
      datasets: [
        {
          label: 'Bénéfice (F CFA)',
          data: [],
          borderColor: '#198754',
          backgroundColor: '#198754',
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: false,
        }
      ]
    };
    this.pieChartData = {
      labels: ['Bénéfice', 'Coûts'],
      datasets: [{ data: [], backgroundColor: ['#198754', '#dc3545'] }]
    };
    return;
  }

  // Construire les labels formatés JJ/MM
  const labels = this.stats.statsParJour.map((stat: any) =>
    new Date(stat.dateCommande).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
  );

  // Extraire et nettoyer les données (avec parseFloat pour s'assurer que ce sont des nombres)
  const ventesData = this.stats.statsParJour.map((s: any) => parseFloat(s.totalVentes) || 0);
  const coutData = this.stats.statsParJour.map((s: any) => parseFloat(s.totalCout) || 0);
  const beneficeData = this.stats.statsParJour.map((s: any) => parseFloat(s.benefice) || 0);

  console.log('Labels:', labels);
  console.log('Ventes:', ventesData);
  console.log('Coûts:', coutData);
  console.log('Bénéfices:', beneficeData);
  console.log('Totaux:', { beneficeTotal: this.stats.beneficeTotal, totalCout: this.stats.totalCout });

  // Reconstruction complète des objets pour forcer rafraîchissement
  this.barChartData = {
    labels,
    datasets: [
      { label: 'Total Ventes (F CFA)', data: ventesData, backgroundColor: '#0d6efd' },
      { label: 'Total Coûts (F CFA)', data: coutData, backgroundColor: '#dc3545' }
    ]
  };

  this.lineChartData = {
    labels,
    datasets: [
      {
        label: 'Bénéfice (F CFA)',
        data: beneficeData,
        borderColor: '#198754',
        backgroundColor: '#198754',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false,
      }
    ]
  };

  this.pieChartData = {
    labels: ['Bénéfice', 'Coûts'],
    datasets: [
      {
        data: [
          parseFloat(this.stats.beneficeTotal) || 0,
          parseFloat(this.stats.totalCout) || 0
        ],
        backgroundColor: ['#198754', '#dc3545']
      }
    ]
  };
  }

  formatDateISO(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  refreshCharts(): void {
    if (!this.stats?.statsParJour) return;

    // Labels formatés (JJ/MM)
    const labels = this.stats.statsParJour.map((stat: any) =>
      new Date(stat.dateCommande).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    );

    // Bar Chart
    this.barChartData.labels = labels;
    this.barChartData.datasets[0].data = this.stats.statsParJour.map((s: any) => s.totalVentes);
    this.barChartData.datasets[1].data = this.stats.statsParJour.map((s: any) => s.totalCout);

    // Line Chart
    this.lineChartData.labels = labels;
    this.lineChartData.datasets[0].data = this.stats.statsParJour.map((s: any) => s.benefice);

    // Pie Chart (totaux sur la période)
    this.pieChartData.datasets[0].data = [this.stats.beneficeTotal, this.stats.totalCout];
  }
}
