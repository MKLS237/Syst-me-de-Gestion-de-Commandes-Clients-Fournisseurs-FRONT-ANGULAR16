import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCommandeComponent } from './page-commande.component';

describe('PageCommandeComponent', () => {
  let component: PageCommandeComponent;
  let fixture: ComponentFixture<PageCommandeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageCommandeComponent]
    });
    fixture = TestBed.createComponent(PageCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
