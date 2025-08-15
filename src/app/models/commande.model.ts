import { Client } from "./client.model";

export interface Commande {
  id?: number;
  client: Client;
  designation: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
  statut: 'LIVREE' | 'NON_LIVREE' | 'LIVREE_PARTIELLEMENT';
  dateCommande: Date;
  dateLivraison?: Date;
}
