import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Facture } from '../models/facture.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:8081/api/factures';

  constructor(private http: HttpClient) {}

  generate(commandeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate/${commandeId}`, {});
  }

  getAllFactures(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getFactureById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // PATCH partiel pour modifier uniquement le statut
  updateStatut(id: number, statut: string): Observable<Facture> {
    return this.http.patch<Facture>(`${this.apiUrl}/${id}/statut`, { statut });
  }

  // PUT complet si besoin
  updateFacture(id: number, facture: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.apiUrl}/${id}`, facture);
  }

  deleteFacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFacturesByClient(clientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/client/${clientId}`);
  }

  getGlobalStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getStatsByClient(clientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/client/${clientId}`);
  }
}