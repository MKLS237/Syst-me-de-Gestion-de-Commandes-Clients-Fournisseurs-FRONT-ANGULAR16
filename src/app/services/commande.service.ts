import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Commande } from '../models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  private baseUrl = 'http://localhost:8081/api/commandes';

  constructor(private http: HttpClient) {}

  // ✅ Get all
  getAll(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.baseUrl);
  }

  // ✅ Get by ID
  getById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.baseUrl}/${id}`);
  }

  // ✅ Add new
  addCommande(commande: Commande): Observable<Commande> {
    return this.http.post<Commande>(this.baseUrl, commande);
  }
  

  // ✅ Update existing
  updateCommande(id: number, commande: Commande): Observable<Commande> {
    return this.http.put<Commande>(`${this.baseUrl}/${id}`, commande);
  }

  // ✅ Delete by ID
  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
getStats(startDate: string, endDate: string) {
  const params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate);

  return this.http.get<any>(`${this.baseUrl}/stats`, { params });
}
}
