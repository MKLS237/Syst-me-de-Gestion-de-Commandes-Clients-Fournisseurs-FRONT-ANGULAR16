import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client.model';
import { Facture } from 'src/app/models/facture.model';
import { ClientService } from 'src/app/services/client-service.service';
import { FactureService } from 'src/app/services/facture-service.service';

@Component({
  selector: 'app-page-facture',
  templateUrl: './page-facture.component.html',
  styleUrls: ['./page-facture.component.scss']
})
export class PageFactureComponent implements OnInit {
  factures: Facture[] = [];
  clients: Client[] = [];
  facturesFiltrees: Facture[] = [];
  pagedFactures: Facture[] = [];

  filtreNomClient = '';
  filtreStatut = '';
  filtreDate = '';
  page = 1;
  pageSize = 7;
  isLoading = false;
  hasError = false;

  factureEnEdition?: Facture;

  constructor(
    private factureService: FactureService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerFactures();
    this.loadClients();
  }

  chargerFactures(): void {
    this.isLoading = true;
    this.hasError = false;

    this.factureService.getAllFactures().subscribe({
      next: data => {
        this.factures = data.sort((a, b) =>
          new Date(b.dateFacture).getTime() - new Date(a.dateFacture).getTime()
        );
        this.filtrerFactures();
        this.isLoading = false;
      },
      error: err => {
        console.error('Erreur chargement des factures', err);
        this.factures = [];
        this.facturesFiltrees = [];
        this.pagedFactures = [];
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: data => this.clients = data,
      error: err => console.error('Erreur chargement des clients', err)
    });
  }

  filtrerFactures(): void {
    const filtreNom = this.filtreNomClient.toLowerCase().trim();
    const filtreStatut = this.filtreStatut.toUpperCase();
    const filtreDate = this.filtreDate;

    this.facturesFiltrees = this.factures.filter(f => {
      const client = this.getFactureClient(f);
      const nomClient = `${client?.prenom || ''} ${client?.nom || ''}`.toLowerCase();
      const matchNom = !filtreNom || nomClient.includes(filtreNom);
      const matchStatut = !filtreStatut || f.statut === filtreStatut;
      const matchDate = !filtreDate || !!f.dateFacture?.includes(filtreDate);
      return matchNom && matchStatut && matchDate;
    });

    this.page = 1;
    this.updatePagedFactures();
  }

  updatePagedFactures(): void {
    const start = (this.page - 1) * this.pageSize;
    this.pagedFactures = this.facturesFiltrees.slice(start, start + this.pageSize);
  }

  getFactureClient(facture: Facture): Client | undefined {
    return facture.client || facture.commande?.client;
  }

  statistiqueFacture(): void {
    this.router.navigate(['/factures/stats']);
  }

  voirFacture(id: number): void {
    this.router.navigate(['/factures/view', id]);
  }

  imprimerFacture(id: number): void {
    const facture = this.factures.find(f => f.id === id);
    if (!facture) {
      alert('Facture introuvable');
      return;
    }

    const commande = facture.commande;
    if (!commande) {
      alert('Aucune commande rattachée à cette facture');
      return;
    }

    const client = this.getFactureClient(facture);
    const content = `
      <html>
        <head>
          <title>Facture N°${facture.numeroFacture || facture.id}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #333; margin: 40px; }
            .entete-facture { display: flex; justify-content: space-between; align-items: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 25px; }
            th, td { border: 1px solid #bbb; padding: 8px; }
            th { background: #f3f3f3; }
          </style>
        </head>
        <body>
          <div class="entete-facture">
            <h2>Facture N°${facture.numeroFacture || facture.id}</h2>
            <p>Date: ${new Date(facture.dateFacture).toLocaleDateString()}</p>
          </div>
          <h4>Informations client</h4>
          <p>${client?.prenom || ''} ${client?.nom || ''} - ${client?.telephone || ''}</p>
          <h4>Informations commande</h4>
          <table>
            <tr><td>N° Commande</td><td>${commande.id || ''}</td></tr>
            <tr><td>Désignation</td><td>${commande.designation}</td></tr>
            <tr><td>Quantité</td><td>${commande.quantite}</td></tr>
            <tr><td>Prix de vente unitaire</td><td>${commande.prixUnitaire.toFixed(2)} FCFA</td></tr>
            <tr><td>Montant total</td><td>${commande.prixTotal.toFixed(2)} FCFA</td></tr>
            <tr><td>Date commande</td><td>${new Date(commande.dateCommande).toLocaleDateString()}</td></tr>
            <tr><td>Date livraison</td><td>${commande.dateLivraison ? new Date(commande.dateLivraison).toLocaleDateString() : ''}</td></tr>
            <tr><td>Statut</td><td>${commande.statut}</td></tr>
          </table>
          <h4>Statut facture</h4>
          <p>${facture.statut}</p>
          <h4>Montant à payer</h4>
          <p>${commande.prixTotal.toFixed(2)} FCFA</p>
          <p>Merci pour votre confiance.<br>Signature et cachet.</p>
        </body>
      </html>
    `;

    const popup = window.open('', '_blank', 'width=800,height=900');
    if (!popup) {
      alert('Impossible d\'ouvrir la fenêtre d\'impression.');
      return;
    }

    popup.document.open();
    popup.document.write(content);
    popup.document.close();
    popup.focus();
    popup.print();
    popup.close();
  }

  supprimerFacture(id: number): void {
    if (confirm('Voulez-vous supprimer cette facture ?')) {
      this.factureService.deleteFacture(id).subscribe(() => this.chargerFactures());
    }
  }

  editFacture(id: number): void {
    this.factureService.getFactureById(id).subscribe(facture => {
      this.factureEnEdition = { ...facture };
    });
  }

  saveEditFacture(): void {
    if (!this.factureEnEdition || !this.factureEnEdition.id) return;

    this.factureService.updateStatut(this.factureEnEdition.id, this.factureEnEdition.statut)
      .subscribe({
        next: () => {
          this.factureEnEdition = undefined;
          this.chargerFactures();
        },
        error: err => {
          alert('Erreur lors de la mise à jour');
          console.error(err);
        }
      });
  }

  cancelEdit(): void {
    this.factureEnEdition = undefined;
  }

  exportCSV(): void {
    const lignes = [
      ['ID', 'Nom Client', 'Montant Total', 'Statut', 'Date Facture'],
      ...this.facturesFiltrees.map(f => {
        const client = this.getFactureClient(f);
        return [
          f.id,
          `${client?.prenom || ''} ${client?.nom || ''}`.trim(),
          f.montantTotal,
          f.statut,
          new Date(f.dateFacture).toLocaleDateString()
        ];
      })
    ];

    const csv = lignes.map(ligne => ligne.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'factures.csv';
    a.click();
  }
}
