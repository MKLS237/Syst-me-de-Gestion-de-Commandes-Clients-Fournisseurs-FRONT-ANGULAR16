import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageClientComponent } from './composants/pages/page-client/page-client.component';
import { PageCommandeComponent } from './composants/pages/page-commande/page-commande.component';
import { ListFactureClientComponent } from './composants/facture/list-facture-client/list-facture-client.component';
import { UpdateClientComponent } from './composants/client/update-client/update-client.component';
import { DetailClientComponent } from './composants/client/detail-client/detail-client.component';
import { DetailCommandeClientComponent } from './composants/commande/detail-commande-client/detail-commande-client.component';
import { LoginComponent } from './auth/login/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './composants/pages/dashboard/dashboard.component';
import { TbordComponent } from './composants/pages/tbord/tbord.component';
import { AddClientComponent } from './composants/client/add-client/add-client.component';
import { AddCommandeClientComponent } from './composants/commande/add-commande-client/add-commande-client.component';
import { CommandeStatsComponent } from './composants/commande/commande-stats/commande-stats.component';
import { PageFactureComponent } from './composants/pages/page-facture/page-facture.component';
import { PageFournisseurComponent } from './composants/pages/page-forunisseur/page-forunisseur.component';
import { StatFacturesComponent } from './composants/facture/stat-factures/stat-factures.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    
    path: '',
    canActivate: [AuthGuard],
    component:DashboardComponent,
    children: [
      {
        path: 'clients',
        component: PageClientComponent
      },
      {
        path: 'commandes',
        component: PageCommandeComponent
      },
      {
        path: 'fournisseur',
        component: PageFournisseurComponent
      },
      {
        path: 'factures',
        component: PageFactureComponent
      },  
      {
        path: 'factures/stats',
        component: StatFacturesComponent
      },
      {
        path: 'statistiques',
        component: TbordComponent
      },
            {
        path: 'statCom',
        component: CommandeStatsComponent
      },
       {
        path: 'clients/add',
        component: AddClientComponent
      },
       {
        path: 'clients/update',
        component: UpdateClientComponent
      },
       { path: 'clients/infos/:id', 
        component: DetailClientComponent },
        { path: 'commandes/add', component: AddCommandeClientComponent },

        { path: 'commandes/infos/:id', component: DetailCommandeClientComponent }, // avec queryParams
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
