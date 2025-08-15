import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fournisseur } from '../models/fournisseur';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })export class FournisseurService {
  private api = 'http://localhost:8081/api/fournisseurs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(this.api);
  }

  create(f: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.api, f);
  }

  update(id: number, f: Fournisseur): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${this.api}/${id}`, f);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}