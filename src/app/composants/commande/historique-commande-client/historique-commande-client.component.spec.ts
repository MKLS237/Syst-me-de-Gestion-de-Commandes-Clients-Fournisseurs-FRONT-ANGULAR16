import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueCommandeClientComponent } from './historique-commande-client.component';

describe('HistoriqueCommandeClientComponent', () => {
  let component: HistoriqueCommandeClientComponent;
  let fixture: ComponentFixture<HistoriqueCommandeClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueCommandeClientComponent]
    });
    fixture = TestBed.createComponent(HistoriqueCommandeClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
