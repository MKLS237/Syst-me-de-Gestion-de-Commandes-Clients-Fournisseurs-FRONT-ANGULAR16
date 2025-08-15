import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client-service.service';


@Component({
  selector: 'app-page-client',
  templateUrl: './page-client.component.html',
  styleUrls: ['./page-client.component.scss']
})
export class PageClientComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm = '';
  page = 1;
  pageSize = 8;


  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAll().subscribe(data => {
      this.clients = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(client =>
      client.nom.toLowerCase().includes(term) ||
      client.prenom.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.telephone.includes(term) ||
      client.prixAchatTotal.toString().includes(term)
    );
  }

  onSearchChange() {
    this.applyFilter();
    this.page = 1;
  }

  get pagedClients(): Client[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredClients.slice(start, start + this.pageSize);
  }

  // ✅ Bouton "Voir"
  viewClient(id: number): void {
    this.router.navigate(['/clients/infos', id]);
  }

  // ✅ Bouton "Modifier"
  editClient(id: number): void {
    this.router.navigate(['/clients/update'], { queryParams: { id } });
  }

  // ✅ Bouton "Supprimer"
  deleteClient(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.clientService.deleteById(id).subscribe(() => {
        this.loadClients();
      });
    }
  }

  // ✅ Bouton "Ajouter"
  addClient(): void {
    this.router.navigate(['clients/add']);
  }

  // ✅ Bouton "Exporter"
  exportClients(): void {
    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Prix Total Achat'];
    const rows = this.clients.map(c => [
      c.nom, c.prenom, c.email, c.telephone, c.prixAchatTotal
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'clients_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ✅ Bouton "Importer" (via un input file)
  importClients(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split('\n');
      lines.shift(); // ignore header
      const newClients: Client[] = [];

      for (let line of lines) {
        const parts = line.split(',');
        if (parts.length >= 8) {
          newClients.push({
            id: 0,
            nom: parts[0].trim(),
            prenom: parts[1].trim(),
            email: parts[2].trim(),
            telephone: parts[3].trim(),
            prixAchatTotal: parseFloat(parts[4])
          });
        }
      }

      // 👉 tu peux les enregistrer un par un ou appeler un endpoint batch
      console.log('Clients importés :', newClients);
      // Tu pourrais appeler this.clientService.addBatch(newClients) si dispo
    };

    reader.readAsText(file);
  }
}