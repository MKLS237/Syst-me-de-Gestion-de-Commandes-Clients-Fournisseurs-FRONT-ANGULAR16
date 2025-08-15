import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './composants/pages/dashboard/dashboard.component';
import { MenuComponent } from './composants/menu/menu.component';
import { PageClientComponent } from './composants/pages/page-client/page-client.component';
import { PageCommandeComponent } from './composants/pages/page-commande/page-commande.component';
import { AddClientComponent } from './composants/client/add-client/add-client.component';
import { DetailClientComponent } from './composants/client/detail-client/detail-client.component';
import { UpdateClientComponent } from './composants/client/update-client/update-client.component';
import { DetailCommandeClientComponent } from './composants/commande/detail-commande-client/detail-commande-client.component';
import { AddCommandeClientComponent } from './composants/commande/add-commande-client/add-commande-client.component';
import { ListFactureComponent } from './composants/facture/list-facture/list-facture.component';
import { DetailFactureComponent } from './composants/facture/detail-facture/detail-facture.component';
import { ListFactureClientComponent } from './composants/facture/list-facture-client/list-facture-client.component';
import { BouttonActionComponent } from './composants/boutton-action/boutton-action.component';
import { HistoriqueCommandeClientComponent } from './composants/commande/historique-commande-client/historique-commande-client.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './auth/login/login/login.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { TbordComponent } from './composants/pages/tbord/tbord.component';
import { CommandeStatsComponent } from './composants/commande/commande-stats/commande-stats.component';
import { PageFactureComponent } from './composants/pages/page-facture/page-facture.component';
import { PageFournisseurComponent } from './composants/pages/page-forunisseur/page-forunisseur.component';
import { ProduitFournisseurComponent } from './composants/produit-fournisseur/produit-fournisseur.component';
import { StatFacturesComponent } from './composants/facture/stat-factures/stat-factures.component';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MenuComponent,
    PageClientComponent,
    PageCommandeComponent,
    AddClientComponent,
    DetailClientComponent,
    UpdateClientComponent,
    DetailCommandeClientComponent,
    AddCommandeClientComponent,
    ListFactureComponent,
    DetailFactureComponent,
    ListFactureClientComponent,
    BouttonActionComponent,
    HistoriqueCommandeClientComponent,
    LoginComponent,
    TbordComponent,
    CommandeStatsComponent,
    PageFactureComponent,
    PageFournisseurComponent,
    ProduitFournisseurComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
     ReactiveFormsModule,
      CommonModule,
     NgChartsModule,
     StatFacturesComponent
  ],
  providers: [  {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
