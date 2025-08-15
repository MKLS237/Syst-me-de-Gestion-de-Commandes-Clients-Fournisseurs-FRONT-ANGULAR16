import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { FactureService } from 'src/app/services/facture-service.service';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stat-factures',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule
  ],
  templateUrl: './stat-factures.component.html',
  styleUrls: ['./stat-factures.component.scss']
})
export class StatFacturesComponent implements OnInit {

  stats: any;
  isLoading = true;

  // Options du graphique camembert
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true
  };

  // Données du graphique camembert avec labels et couleurs
  pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Payées', 'Partiellement payées', 'Non payées'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#198754', '#ffc107', '#dc3545'] // Couleurs Bootstrap vert, jaune, rouge
      }
    ]
  };

  // <<< Correction principale ici, littéral string 'pie'
  pieChartType: 'pie' = 'pie';
 

  constructor(private factureService: FactureService, private router:Router) {}

  ngOnInit(): void {
    this.factureService.getGlobalStats().subscribe(data => {
      this.stats = data;

      this.pieChartData.datasets[0].data = [
        this.stats.montantTotalPayees,
        this.stats.montantTotalPartiellementPayees,
        this.stats.montantTotalNonPayees
      ];

      this.isLoading = false;
    });
  }
  
  cancel(): void {
    this.router.navigate(['/factures']);
  }
}
