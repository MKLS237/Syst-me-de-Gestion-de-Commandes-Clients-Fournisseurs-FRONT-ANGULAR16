import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client.model';
import { Commande } from 'src/app/models/commande.model';
import { ClientService } from 'src/app/services/client-service.service';
import { CommandeService } from 'src/app/services/commande.service';
import { FactureService } from 'src/app/services/facture-service.service';

@Component({
  selector: 'app-page-commande',
  templateUrl: './page-commande.component.html',
  styleUrls: ['./page-commande.component.scss']
})

export class PageCommandeComponent implements OnInit {

  commandes: Commande[] = [];
  clients: Client[] = [];
  filteredCommandes: Commande[] = [];
  pagedCommandes: Commande[] = [];
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 7;

  constructor(
    private commandeService: CommandeService,
    private clientService: ClientService,
    private factureService: FactureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
    this.loadClients();
  }

 loadCommandes(): void {
  this.commandeService.getAll().subscribe(data => {
    // Trier par dateCommande décroissante (nouvelle d'abord)
    this.commandes = data.sort((a, b) => {
      return new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime();
    });
    this.onSearchChange();
  });
}

  loadClients() {
    this.clientService.getAll().subscribe(data => {
      this.clients = data;
    });
  }

 getNomClient(clientId: number): string {
  const client = this.clients.find(c => c.id === clientId);
  return client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
}

  genererFactureDepuisCommande(commandeId: number): void {
    this.factureService.generate(commandeId).subscribe(() => {
      alert('Facture générée avec succès.');
    });
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCommandes = this.commandes.filter(c =>
      c.designation.toLowerCase().includes(term) ||
      c.statut.toLowerCase().includes(term) ||
      new Date(c.dateCommande).toLocaleDateString().includes(term)
    );
    this.page = 1;
    this.updatePagedCommandes();
  }

  updatePagedCommandes(): void {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedCommandes = this.filteredCommandes.slice(start, end);
  }

  getTotalCommande(commande: Commande): number {
    return commande.prixTotal;
  }

  getQuantiteTotale(commande: Commande): number {
    return commande.quantite;
  }

  addCommande(): void {
    this.router.navigate(['/commandes/add']);
  }

  statCom(): void {
    this.router.navigate(['statCom']);
  }

  editCommande(id: number): void {
    this.router.navigate(['/commandes/edit'], { queryParams: { id } });
  }

  viewCommande(id: number): void {
    this.router.navigate(['/commandes/infos', id]);
  }

  deleteCommande(id: number): void {
    if (confirm('Voulez-vous supprimer cette commande ?')) {
      this.commandeService.deleteById(id).subscribe(() => this.loadCommandes());
    }
  }

  exportCommandes(): void {
    const headers = ['ID', 'Client', 'Désignation', 'Quantité', 'PU', 'Total', 'Statut', 'Date Cmd', 'Date Livr.'];
    const rows = this.commandes.map(c => [
      c.id,
      c.client,
      c.designation,
      c.quantite,
      c.prixUnitaire,
      c.prixTotal,
      c.statut,
      new Date(c.dateCommande).toLocaleDateString(),
      c.dateLivraison ? new Date(c.dateLivraison).toLocaleDateString() : ''
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
    

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'commandes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

 /* importCommandes(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split('\n');
      lines.shift(); // ignore le header

   const commandes: Commande[] = lines.map(line => {
  const [id, clientId, designation, quantite, pu, total, statut, dateCmd, dateLivr] = line.split(',');

  return {
    id: Number(id),
    clientId: this.clients.find(c => c.id === Number(clientId))!,  // ✅ Corrigé ici
    designation: designation.trim(),
    quantite: Number(quantite),
    prixUnitaire: Number(pu),
    prixTotal: Number(total),
    statut: statut.trim() as any,
    dateCommande: new Date(dateCmd),
    dateLivraison: dateLivr?.trim() ? new Date(dateLivr) : undefined
  };
});


      console.log('Commandes importées :', commandes);
      // Tu pourras ensuite appeler un batch d’import si tu le mets en place
    };

    reader.readAsText(file);
  }*/
}