import { TestBed } from '@angular/core/testing';

import { ProduitFournisseurService } from './produit-fournisseur.service';

describe('ProduitFournisseurService', () => {
  let service: ProduitFournisseurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProduitFournisseurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
