export interface ProduitFournisseur {
  id?: number;
  nomProduit: string;
  prixUnitaire: number;
  unite: string;
  fournisseurId: number; // pour lier au fournisseur
}
