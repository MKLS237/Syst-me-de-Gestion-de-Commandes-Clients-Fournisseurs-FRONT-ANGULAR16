import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/models/client.model';
import { Commande } from 'src/app/models/commande.model';
import { Facture } from 'src/app/models/facture.model';
import { ClientService } from 'src/app/services/client-service.service';

@Component({
  selector: 'app-detail-client',
  templateUrl: './detail-client.component.html',
  styleUrls: ['./detail-client.component.scss']
})
export class DetailClientComponent implements OnInit {

  client!: Client;
  commandes: Commande[] = [];
  factures: Facture[] = [];

  constructor(
    private route: ActivatedRoute,
      private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  if (id) {
    this.clientService.getById(id).subscribe(client => this.client = client);
    this.clientService.getCommandesByClient(id).subscribe(cmds => this.commandes = cmds);
    this.clientService.getFacturesByClient(id).subscribe(facs => this.factures = facs);
  }
});
  }
    cancel(): void {
    this.router.navigate(['/clients']);
  }
}
