import { Component, OnInit } from '@angular/core';
import { Fournisseur } from 'src/app/models/fournisseur';
import { ProduitFournisseur } from 'src/app/models/produit-fournisseur';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { ProduitFournisseurService } from 'src/app/services/produit-fournisseur.service';

@Component({
  selector: 'app-page-forunisseur',
  templateUrl: './page-forunisseur.component.html',
  styleUrls: ['./page-forunisseur.component.scss']
})
export class PageFournisseurComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  filteredFournisseurs: Fournisseur[] = [];
  selectedFournisseur: Fournisseur = this.resetFournisseur();
  isEdit = false;
  searchTerm = '';

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

  getFournisseurs(): void {
    this.fournisseurService.getAll().subscribe(data => {
      this.fournisseurs = data;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredFournisseurs = this.fournisseurs.filter(f =>
      (f.nom || '').toLowerCase().includes(term) ||
      (f.entreprise || '').toLowerCase().includes(term) ||
      (f.email || '').toLowerCase().includes(term) ||
      (f.telephone || '').toLowerCase().includes(term)
    );
  }

  saveFournisseur(): void {
    const request = this.selectedFournisseur.id
      ? this.fournisseurService.update(this.selectedFournisseur.id, this.selectedFournisseur)
      : this.fournisseurService.create(this.selectedFournisseur);

    request.subscribe(savedFournisseur => {
      this.selectedFournisseur = savedFournisseur;
      this.isEdit = true;
      this.showProduitsSection = true;
      this.produits = [];
      this.selectedProduit = this.resetProduit();
      this.selectedProduit.fournisseurId = savedFournisseur.id!;
      this.getFournisseurs();
    });
  }

  edit(f: Fournisseur): void {
    this.selectedFournisseur = { ...f };
    this.isEdit = true;
  }

  delete(id?: number): void {
    if (id && confirm('Voulez-vous supprimer ce fournisseur ?')) {
      this.fournisseurService.delete(id).subscribe(() => this.getFournisseurs());
    }
  }

  cancel(): void {
    this.selectedFournisseur = this.resetFournisseur();
    this.isEdit = false;
    this.showProduitsSection = false;
  }

  ouvrirProduitsModal(fournisseur: Fournisseur): void {
    this.selectedFournisseur = fournisseur;
    this.isEdit = true;
    this.produitFournisseurService.getByFournisseurId(fournisseur.id!).subscribe(data => {
      this.produits = data;
      this.selectedProduit = this.resetProduit();
      this.selectedProduit.fournisseurId = fournisseur.id!;
      this.showProduitsSection = true;
    });
  }

  saveProduit(): void {
    if (!this.selectedFournisseur.id) {
      alert("Enregistrez d'abord le fournisseur avant d'ajouter ses produits.");
      return;
    }

    const request = this.selectedProduit.id
      ? this.produitFournisseurService.updateProduit(this.selectedProduit.id, this.selectedProduit)
      : this.produitFournisseurService.createProduit(this.selectedFournisseur.id, this.selectedProduit);

    request.subscribe(() => {
      this.ouvrirProduitsModal(this.selectedFournisseur);
      this.selectedProduit = this.resetProduit();
      this.selectedProduit.fournisseurId = this.selectedFournisseur.id!;
    });
  }

  editProduit(p: ProduitFournisseur): void {
    this.selectedProduit = { ...p };
  }

  deleteProduit(id?: number): void {
    if (id && confirm('Voulez-vous supprimer ce produit fournisseur ?')) {
      this.produitFournisseurService.deleteProduit(id).subscribe(() => {
        this.ouvrirProduitsModal(this.selectedFournisseur);
      });
    }
  }
}
