import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Commande } from 'src/app/models/commande.model';
import { CommandeService } from 'src/app/services/commande.service';

@Component({
  selector: 'app-commande-stats',
  templateUrl: './commande-stats.component.html',
  styleUrls: ['./commande-stats.component.scss']
})
export class CommandeStatsComponent implements OnInit {
  form: FormGroup;
  stats: any;
  nonLivreesAnciennes: Commande[] = [];
  isLoading = false;
  hasError = false;

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } }
  };
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { label: 'Ventes', data: [], backgroundColor: '#2563eb', borderRadius: 6 },
      { label: 'Coûts', data: [], backgroundColor: '#ef4444', borderRadius: 6 }
    ]
  };
  barChartType: 'bar' = 'bar';

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } }
  };
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Bénéfice',
        data: [],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.14)',
        tension: 0.35,
        fill: true
      }
    ]
  };
  lineChartType: 'line' = 'line';

  pieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };
  pieChartData: ChartData<'doughnut'> = {
    labels: ['Bénéfice', 'Coûts'],
    datasets: [{ data: [], backgroundColor: ['#22c55e', '#ef4444'] }]
  };
  pieChartType: 'doughnut' = 'doughnut';

  constructor(private fb: FormBuilder, private commandeService: CommandeService) {
    this.form = this.fb.group({ startDate: [''], endDate: [''] });
  }

  ngOnInit(): void {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    this.form.patchValue({
      startDate: this.formatDateISO(sevenDaysAgo),
      endDate: this.formatDateISO(today)
    });

    this.rechercherStats();
  }

  rechercherStats(): void {
    const { startDate, endDate } = this.form.value;
    if (!startDate || !endDate) return;

    this.isLoading = true;
    this.hasError = false;

    this.commandeService.getStats(startDate, endDate).subscribe({
      next: (res) => {
        this.stats = res;
        this.nonLivreesAnciennes = res.nonLivreesAnciennes || [];
        this.refreshCharts();
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  refreshCharts(): void {
    const statsParJour = this.stats?.statsParJour || [];
    const labels = statsParJour.map((stat: any) =>
      new Date(stat.dateCommande).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    );

    this.barChartData = {
      labels,
      datasets: [
        { label: 'Ventes', data: statsParJour.map((s: any) => Number(s.totalVentes) || 0), backgroundColor: '#2563eb', borderRadius: 6 },
        { label: 'Coûts', data: statsParJour.map((s: any) => Number(s.totalCout) || 0), backgroundColor: '#ef4444', borderRadius: 6 }
      ]
    };

    this.lineChartData = {
      labels,
      datasets: [
        {
          label: 'Bénéfice',
          data: statsParJour.map((s: any) => Number(s.benefice) || 0),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.14)',
          tension: 0.35,
          fill: true
        }
      ]
    };

    this.pieChartData = {
      labels: ['Bénéfice', 'Coûts'],
      datasets: [{
        data: [Number(this.stats?.beneficeTotal) || 0, Number(this.stats?.totalCout) || 0],
        backgroundColor: ['#22c55e', '#ef4444']
      }]
    };
  }

  formatDateISO(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
