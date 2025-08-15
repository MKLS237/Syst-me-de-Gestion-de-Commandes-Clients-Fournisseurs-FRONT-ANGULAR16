import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client.model';
import { Commande } from 'src/app/models/commande.model';
import { ClientService } from 'src/app/services/client-service.service';
import { CommandeService } from 'src/app/services/commande.service';

@Component({
  selector: 'app-add-commande-client',
  templateUrl: './add-commande-client.component.html',
  styleUrls: ['./add-commande-client.component.scss']
})
export class AddCommandeClientComponent implements OnInit {

  clients: Client[] = [];
  selectedClientId: number | null = null;

  newCommande: Partial<Commande> = {
    designation: '',
    quantite: 1,
    prixUnitaire: 0,
    statut: 'NON_LIVREE',
    dateCommande: new Date(),
    dateLivraison: undefined
  };

  constructor(
    private clientService: ClientService,
    private commandeService: CommandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientService.getAll().subscribe(data => {
      this.clients = data;
    });
  }

  calculerPrixTotal(): number {
    return (this.newCommande.quantite ?? 0) * (this.newCommande.prixUnitaire ?? 0);
  }

  saveCommande(): void {
    if (
      !this.selectedClientId ||
      !this.newCommande.designation ||
      !this.newCommande.quantite ||
      !this.newCommande.prixUnitaire
    ) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const clientSelectionne = this.clients.find(c => c.id === this.selectedClientId);
    if (!clientSelectionne) {
      alert("Client introuvable.");
      return;
    }

    const commandeToSend: Commande = {
      client: clientSelectionne, // 👈 Envoi de l'objet client complet
      designation: this.newCommande.designation!,
      quantite: this.newCommande.quantite!,
      prixUnitaire: this.newCommande.prixUnitaire!,
      prixTotal: this.calculerPrixTotal(),
      statut: this.newCommande.statut!,
      dateCommande: this.newCommande.dateCommande ?? new Date(),
      dateLivraison: this.newCommande.dateLivraison
    };

    this.commandeService.addCommande(commandeToSend).subscribe(() => {
      alert('Commande ajoutée avec succès');
      this.router.navigate(['/commandes']);
    });
  }

  cancel(): void {
    this.router.navigate(['/commandes']);
  }
}