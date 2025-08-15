import { Component, OnInit } from '@angular/core';
import { Facture } from 'src/app/models/facture.model';
import { Client } from 'src/app/models/client.model';
import { Router } from '@angular/router';
import { FactureService } from 'src/app/services/facture-service.service';
import { ClientService } from 'src/app/services/client-service.service';

@Component({
  selector: 'app-page-facture',
  templateUrl: './page-facture.component.html',
  styleUrls: ['./page-facture.component.scss']
})
export class PageFactureComponent implements OnInit {

  factures: Facture[] = [];
  clients: Client[] = [];

  filtreNomClient: string = '';
  filtreStatut: string = '';
  filtreDate: string = '';

  facturesFiltrees: Facture[] = [];
  pagedFactures: Facture[] = [];

  page: number = 1;
  pageSize: number = 7;

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

  // Chargement initial des factures
  chargerFactures(): void {
    this.factureService.getAllFactures().subscribe(data => {
      this.factures = data.sort((a, b) => { 
        return new Date(b.dateFacture).getTime() - new Date(a.dateFacture).getTime();});
      this.filtrerFactures(); // initialise la liste filtrée et la pagination
    });
  }
  

  // Chargement des clients
  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Erreur chargement des clients', err)
    });
  }

  // Récupérer le nom complet d'un client par ID
  getNomClient(clientId: number): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
  }

  // Filtrage simple des factures
  filtrerFactures(): void {
    const filtreNom = this.filtreNomClient.toLowerCase();
    const filtreStatut = this.filtreStatut.toUpperCase();
    const filtreDateFiltree = this.filtreDate;

    this.facturesFiltrees = this.factures.filter(f => {
      const nomClient = `${f.client?.prenom} ${f.client?.nom}`.toLowerCase();
      const matchNom = nomClient.includes(filtreNom);
      const matchStatut = !filtreStatut || f.statut === filtreStatut;
      const matchDate = !filtreDateFiltree || (f.dateFacture && f.dateFacture.includes(filtreDateFiltree));
      return matchNom && matchStatut && matchDate;
    });

    this.page = 1;
    this.updatePagedFactures();
  }

  // Pagination
  updatePagedFactures(): void {
    const source = this.facturesFiltrees.length ? this.facturesFiltrees : this.factures;
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedFactures = source.slice(start, end);
  }

  // Navigation vers la page des statistiques (ou autre)
  statistiqueFacture(): void {
    this.router.navigate(['/factures/stats']);
  }

  // Voir une facture (navigation)
  voirFacture(id: number): void {
    this.router.navigate(['/factures/view', id]);
  }

  // Imprimer facture (taille et mise en forme simplifiées)
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

    const content = `
      <html>
        <head>
          <title>Facture N°${facture.numeroFacture || facture.id}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #333; margin: 40px; }
            .entete-facture { display: flex; justify-content: space-between; align-items: center; }
            .logo { height: 60px; }
            table { width: 100%; border-collapse: collapse; margin-top: 25px; }
            th, td { border: 1px solid #bbb; padding: 8px; }
            th { background: #f3f3f3; }
          </style>
        </head>
        <body>
          <div class="entete-facture">
            <img src="/assets/logo.png" alt="Logo entreprise" class="logo" />
            <div>
              <h2>Facture N°${facture.numeroFacture || facture.id}${facture.client.id}${facture.commande.id}</h2>
              <p>Date: ${new Date(facture.dateFacture).toLocaleDateString()}</p>
            </div>
          </div>
          <h4>Informations client</h4>
          <p>${facture.client?.prenom} ${facture.client?.nom} - ${facture.client?.telephone || ''}</p>
          <h4>Informations commande</h4>
          <table>
            <tr><td>N° Commande</td><td>${commande.id}</td></tr>
            <tr><td>Désignation</td><td>${commande.designation}</td></tr>
            <tr><td>Quantité</td><td>${commande.quantite}</td></tr>
            <tr><td>Prix unitaire</td><td>${commande.prixUnitaire.toFixed(2)} FCFA</td></tr>
            <tr><td>Montant total</td><td>${commande.prixTotal.toFixed(2)} FCFA</td></tr>
            <tr><td>Date commande</td><td>${new Date(commande.dateCommande).toLocaleDateString()}</td></tr>
            <tr><td>Date livraison</td><td>${commande.dateLivraison ? new Date(commande.dateLivraison).toLocaleDateString() : ''}</td></tr>
            <tr><td>Statut</td><td>${commande.statut}</td></tr>
          </table>
          <h4>Statut facture</h4>
          <p>${facture.statut}</p>
          <h4> <strong> <u> Montant a payer  </u> </strong> </h4>
          <p>${commande.prixTotal.toFixed(2)} FCFA</p>
          <p>Merci pour votre confiance.<br>Signature et cachet.</p>
        </body>
      </html>
    `;

    const popup = window.open('', '_blank', 'width=800,height=900');
    if (popup) {
      popup.document.open();
      popup.document.write(content);
      popup.document.close();
      popup.focus();
      popup.print();
      popup.close();
    } else {
      alert('Impossible d\'ouvrir la fenêtre d\'impression.');
    }
  }

  // Supprimer une facture
  supprimerFacture(id: number): void {
    if (confirm('Voulez-vous supprimer cette facture ?')) {
      this.factureService.deleteFacture(id).subscribe(() => {
        this.chargerFactures();
      });
    }
  }

  // Édition du statut - charger facture complète avant modification
  editFacture(id: number): void {
    this.factureService.getFactureById(id).subscribe(facture => {
      this.factureEnEdition = { ...facture }; // copie complète
    });
  }

  // Sauvegarder la mise à jour du statut (envoi de l'entité complète)
  saveEditFacture(): void {
  if (!this.factureEnEdition || !this.factureEnEdition.id) return;

  // Envoie uniquement le champ statut via PATCH
  this.factureService.updateStatut(this.factureEnEdition.id, this.factureEnEdition.statut)
    .subscribe({
      next: () => {
        alert('Statut de la facture mis à jour');
        this.factureEnEdition = undefined;
        this.chargerFactures(); // recharge la liste mise à jour
      },
      error: (err) => {
        alert('Erreur lors de la mise à jour');
        console.error(err);
      }
    });
}
  // Annuler édition
  cancelEdit(): void {
    this.factureEnEdition = undefined;
  }

  // Générer une facture à partir d'une commande
  genererDepuisCommande(): void {
    const id = prompt('Entrez l’ID de la commande à facturer :');
    if (id) {
      this.factureService.generate(+id).subscribe(() => {
        alert('Facture générée avec succès !');
        this.chargerFactures();
      });
    }
  }

  // Navigation vers statistiques
  allerStats(): void {
    this.router.navigate(['/factures/stats']);
  }

  // Export CSV avec filtres appliqués
  exportCSV(): void {
    const source = this.facturesFiltrees.length ? this.facturesFiltrees : this.factures;
    const lignes = [
      ['ID', 'Nom Client', 'Montant Total', 'Statut', 'Date Facture'],
      ...source.map(f => [
        f.id,
        `${f.client?.prenom} ${f.client?.nom}`,
        f.montantTotal,
        f.statut,
        new Date(f.dateFacture).toLocaleDateString()
      ])
    ];

    const csv = lignes.map(ligne => ligne.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'factures.csv';
    a.click();
  }
}
