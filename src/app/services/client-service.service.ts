import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, Statistiques } from '../models/client.model';
import { Commande } from '../models/commande.model';
import { Facture } from '../models/facture.model';


@Injectable({ providedIn: 'root' })
export class ClientService {
  private baseUrl = 'http://localhost:8081/api/clients';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }
  
getStats(): Observable<Statistiques> {
  return this.http.get<Statistiques>(`${this.baseUrl}/stats`);
}

createClient(client: Client): Observable<Client> {
  return this.http.post<Client>(this.baseUrl, client);
}
updateClient(id: number, client: Client): Observable<Client> {
  return this.http.put<Client>(`${this.baseUrl}/${id}`, client);
}

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  getCommandesByClient(id: number): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.baseUrl}/${id}/commandes`);
  }

  getFacturesByClient(id: number): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.baseUrl}/${id}/factures`);
  }
  deleteById(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${id}`);
}
}
