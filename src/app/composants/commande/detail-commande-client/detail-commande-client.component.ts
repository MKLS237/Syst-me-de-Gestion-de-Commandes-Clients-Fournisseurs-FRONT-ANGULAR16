import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/models/client.model';
import { Commande } from 'src/app/models/commande.model';
import { Facture } from 'src/app/models/facture.model';
import { ClientService } from 'src/app/services/client-service.service';
import { CommandeService } from 'src/app/services/commande.service';
import { FactureService } from 'src/app/services/facture-service.service';

@Component({
  selector: 'app-detail-commande-client',
  templateUrl: './detail-commande-client.component.html',
  styleUrls: ['./detail-commande-client.component.scss']
})
export class DetailCommandeClientComponent implements OnInit {
  commandeId!: number;
  commande!: Commande;
  clients: Client[] = [];
  statutOptions: string[] = ['NON_LIVREE', 'LIVREE', 'LIVREE_PARTIELLEMENT'];
  facture?: Facture;
  loading = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService,
    private factureService: FactureService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.commandeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCommande();
    this.loadClients(); // 👈
  }

  loadCommande(): void {
    this.loading = true;
    this.commandeService.getById(this.commandeId).subscribe({
      next: (data) => {
        this.commande = data;
        this.loading = false;
      },
      error: () => {
        this.message = "Erreur de chargement de la commande.";
        this.loading = false;
      }
    });
  }
   loadClients() {
  this.clientService.getAll().subscribe({
    next: (data) => {
      this.clients = data;
    },
    error: (err) => {
      console.error('Erreur chargement des clients', err);
    }
  });
}
  getNomClient(clientId: number): string {
  const client = this.clients.find(c => c.id === clientId);
  return client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
}

/* 
onStatutChange(): void {
    if (this.commande.statut.includes('LIVREE')) {
      this.factureService.generate(this.commande.id!).subscribe({
        next: (facture) => {
          this.facture = facture;
          console.log("Facture générée :", facture);
        },
        error: () => console.error('Erreur lors de la génération de la facture')
      });
    }
  } */

  updateCommande(): void {
    this.commandeService.updateCommande(this.commandeId, this.commande).subscribe({
      next: (updated) => {
        this.message = "Commande mise à jour avec succès.";
       if (updated.statut === 'LIVREE' || updated.statut === 'LIVREE_PARTIELLEMENT') {
  this.factureService.generate(updated.id!).subscribe({
    next: (facture) => {
      this.facture = facture;
      console.log("Facture générée :", facture);
    },
    error: () => console.error('Erreur lors de la génération de la facture')
  });
}
      },
      error: () => {
        this.message = "Erreur lors de la mise à jour.";
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/commandes']);
  }
}
