import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client-service.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent {
  client: Client = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    prixAchatTotal: 0
  };

  constructor(private clientService: ClientService, private router: Router) {}

  onSubmit(): void {
    this.clientService.createClient(this.client).subscribe(() => {
      alert('Client ajouté avec succès.');
      this.router.navigate(['/clients']);
    });
  }

  cancel(): void {
    this.router.navigate(['/clients']);
  }
}
