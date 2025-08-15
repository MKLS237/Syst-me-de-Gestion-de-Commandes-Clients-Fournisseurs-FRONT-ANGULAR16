export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  prixAchatTotal: number;
}
export interface Statistiques {
  montantFacturesNonPayees: number;
  nombreFactures: number;
  nombreFacturesPayees: number;
  nombreCommandesNonLivrees: number;
  nombreClients: number;
  nombreCommandes: number;
  nombreCommandesLivrees: number;
}