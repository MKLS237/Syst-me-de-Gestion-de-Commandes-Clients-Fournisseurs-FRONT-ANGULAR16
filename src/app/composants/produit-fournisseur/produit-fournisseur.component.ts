import { Component, Input, OnInit } from '@angular/core';
import { ProduitFournisseur } from 'src/app/models/produit-fournisseur';
import { ProduitFournisseurService } from 'src/app/services/produit-fournisseur.service';

@Component({
  selector: 'app-produit-fournisseur',
  templateUrl: './produit-fournisseur.component.html',
  styleUrls: ['./produit-fournisseur.component.scss']
})
export class ProduitFournisseurComponent implements OnInit {
  @Input() idFournisseur!: number;

  produits: ProduitFournisseur[] = [];

  nouveauProduit: ProduitFournisseur = this.initProduit();

  modifierMode: boolean = false;
  produitEnCours?: ProduitFournisseur;

  constructor(private produitService: ProduitFournisseurService) {}

  ngOnInit(): void {
    if (this.idFournisseur) {
      this.chargerProduits();
    }
  }

  // Initialise un produit vide
  private initProduit(): ProduitFournisseur {
    return {
      nomProduit: '',
      prixUnitaire: 0,
      unite: '',
      fournisseurId: this.idFournisseur
    };
  }

  chargerProduits(): void {
    this.produitService.getByFournisseurId(this.idFournisseur).subscribe(data => {
      this.produits = data;
    });
  }

  ajouterOuModifier(): void {
    if (!this.nouveauProduit.nomProduit || !this.nouveauProduit.unite || !this.nouveauProduit.prixUnitaire) return;

    if (this.modifierMode && this.produitEnCours) {
      this.produitService.updateProduit(this.produitEnCours.id!, this.nouveauProduit).subscribe(() => {
        this.resetForm();
        this.chargerProduits();
      });
    } else {
      this.nouveauProduit.fournisseurId = this.idFournisseur;
      this.produitService.createProduit(this.idFournisseur, this.nouveauProduit).subscribe(() => {
        this.resetForm();
        this.chargerProduits();
      });
    }
  }

  editerProduit(produit: ProduitFournisseur): void {
    this.modifierMode = true;
    this.produitEnCours = produit;
    this.nouveauProduit = { ...produit }; // Deep copy pour édition
  }

  supprimerProduit(id: number): void {
    if (confirm('Supprimer ce produit ?')) {
      this.produitService.deleteProduit(id).subscribe(() => this.chargerProduits());
    }
  }

  annulerModification(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.modifierMode = false;
    this.produitEnCours = undefined;
    this.nouveauProduit = this.initProduit();
  }
}