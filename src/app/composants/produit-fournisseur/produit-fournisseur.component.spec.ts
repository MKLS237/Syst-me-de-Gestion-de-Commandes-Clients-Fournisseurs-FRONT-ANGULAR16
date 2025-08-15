import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitFournisseurComponent } from './produit-fournisseur.component';

describe('ProduitFournisseurComponent', () => {
  let component: ProduitFournisseurComponent;
  let fixture: ComponentFixture<ProduitFournisseurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProduitFournisseurComponent]
    });
    fixture = TestBed.createComponent(ProduitFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
