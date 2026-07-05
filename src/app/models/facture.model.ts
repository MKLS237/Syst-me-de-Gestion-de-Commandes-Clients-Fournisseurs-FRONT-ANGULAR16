import { Client } from './client.model';
import { Commande } from './commande.model';

export interface Facture {
  id?: number;
  dateFacture: string;
  montantTotal: number;
  statut: 'PAYEE' | 'NON_PAYEE' | 'PARTIELLEMENT_PAYEE';
  numeroFacture?: string;
  commande: Commande;
  client?: Client;
}
