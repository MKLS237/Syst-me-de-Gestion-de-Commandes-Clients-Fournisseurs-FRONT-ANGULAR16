import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client-service.service';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.scss']
})
export class UpdateClientComponent implements OnInit {

  client: Client = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    prixAchatTotal: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    const clientId = Number(this.route.snapshot.queryParamMap.get('id'));
    if (clientId) {
      this.clientService.getById(clientId).subscribe(data => {
        this.client = data;
      });
    }
  }

  onSubmit(): void {
    if (this.client.id) {
      this.clientService.updateClient(this.client.id, this.client).subscribe({
        next: () => this.router.navigate(['/clients']),
        error: (err) => console.error('Erreur lors de la mise à jour', err)
      });
    }
  }
    cancel(): void {
    this.router.navigate(['/clients']);
  }
}