import { Component, OnInit } from '@angular/core';
import { Fournisseur } from 'src/app/models/fournisseur';
import { ProduitFournisseur } from 'src/app/models/produit-fournisseur';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { ProduitFournisseurService } from 'src/app/services/produit-fournisseur.service';

@Component({
  selector: 'app-page-forunisseur',
  templateUrl: './page-forunisseur.component.html',
  styleUrls: ['./page-forunisseur.component.scss']
})export class PageFournisseurComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  selectedFournisseur: Fournisseur = this.resetFournisseur();
  isEdit = false;

  produits: ProduitFournisseur[] = [];
  selectedProduit: ProduitFournisseur = this.resetProduit();
  showProduitsSection = false;

  constructor(
    private fournisseurService: FournisseurService,
    private produitFournisseurService: ProduitFournisseurService
  ) {}

  ngOnInit(): void {
    this.getFournisseurs();
  }

   resetFournisseur(): Fournisseur {
    return { id: undefined, nom: '', adresse: '', telephone: '', email: '', entreprise: '' };
  }

 resetProduit(): ProduitFournisseur {
    return { nomProduit: '', prixUnitaire: 0, unite: '', fournisseurId: 0 };
  }

  getFournisseurs() {
    this.fournisseurService.getAll().subscribe(data => this.fournisseurs = data);
  }

   save() {
    if (!this.selectedFournisseur?.id) {
      alert("Veuillez d'abord sélectionner un fournisseur existant avant d'ajouter un produit.");
      return;
    }

    if (this.selectedProduit.id) {
      this.produitFournisseurService.updateProduit(this.selectedProduit.id, this.selectedProduit).subscribe(() => {
        this.ouvrirProduitsModal(this.selectedFournisseur);
      });
    } else {
      this.produitFournisseurService.createProduit(this.selectedFournisseur.id, this.selectedProduit).subscribe(() => {
        this.ouvrirProduitsModal(this.selectedFournisseur);
      });
    }

    this.selectedProduit = this.resetProduit();
    this.selectedProduit.fournisseurId = this.selectedFournisseur.id;
  }

  edit(f: Fournisseur) {
    this.selectedFournisseur = { ...f };
    this.isEdit = true;
  }

  delete(id?: number) {
    if (id) {
      this.fournisseurService.delete(id).subscribe(() => this.getFournisseurs());
    }
  }

  cancel() {
    this.selectedFournisseur = this.resetFournisseur();
    this.isEdit = false;
    this.showProduitsSection = false;
  }

  ouvrirProduitsModal(fournisseur: Fournisseur) {
    this.selectedFournisseur = fournisseur;
    this.produitFournisseurService.getByFournisseurId(fournisseur.id!).subscribe(data => {
      this.produits = data;
      this.selectedProduit = this.resetProduit();
      this.selectedProduit.fournisseurId = fournisseur.id!;
      this.showProduitsSection = true;
    });
  }

  saveProduit() {
    if (this.selectedProduit.id) {
      this.produitFournisseurService.updateProduit(this.selectedProduit.id, this.selectedProduit).subscribe(() => {
        this.ouvrirProduitsModal(this.selectedFournisseur);
      });
    } else {
      this.produitFournisseurService.createProduit(this.selectedFournisseur.id!, this.selectedProduit).subscribe(() => {
        this.ouvrirProduitsModal(this.selectedFournisseur);
      });
    }
    this.selectedProduit = this.resetProduit();
    this.selectedProduit.fournisseurId = this.selectedFournisseur.id!;
  }

  editProduit(p: ProduitFournisseur) {
    this.selectedProduit = { ...p };
  }

  deleteProduit(id?: number) {
    if (id) {
      this.produitFournisseurService.deleteProduit(id).subscribe(() => {
        this.ouvrirProduitsModal(this.selectedFournisseur);
      });
    }
  }
}