import { Client } from "./client.model";
import { Commande } from "./commande.model";

export interface Facture {
  id?: number;
  dateFacture: string;
  montantTotal: number;
  statut: 'PAYÉE' | 'NON_PAYÉE' | 'EN_ATTENTE';  // ✅ Typé
  numeroFacture?: string; // ✅ Suggestion : numéro unique lisible (ex: FACT-202507-001)
  commande: Commande;
  client:Client;
}