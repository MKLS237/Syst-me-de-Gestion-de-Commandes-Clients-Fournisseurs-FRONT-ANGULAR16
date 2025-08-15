import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProduitFournisseur } from '../models/produit-fournisseur';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProduitFournisseurService {
 private api = 'http://localhost:8081/api/produit';

  constructor(private http: HttpClient) {}

  getByFournisseurId(fournisseurId: number): Observable<ProduitFournisseur[]> {
    return this.http.get<ProduitFournisseur[]>(`${this.api}/fournisseur/${fournisseurId}`);
  }

  createProduit(fournisseurId: number, produit: ProduitFournisseur): Observable<ProduitFournisseur> {
    return this.http.post<ProduitFournisseur>(`${this.api}/fournisseur/${fournisseurId}`, produit);
  }

  updateProduit(id: number, produit: ProduitFournisseur): Observable<ProduitFournisseur> {
    return this.http.put<ProduitFournisseur>(`${this.api}/${id}`, produit);
  }

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}