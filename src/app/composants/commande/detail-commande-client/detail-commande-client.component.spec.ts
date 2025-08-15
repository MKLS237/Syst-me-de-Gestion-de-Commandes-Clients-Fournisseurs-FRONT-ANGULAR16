import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCommandeClientComponent } from './detail-commande-client.component';

describe('DetailCommandeClientComponent', () => {
  let component: DetailCommandeClientComponent;
  let fixture: ComponentFixture<DetailCommandeClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailCommandeClientComponent]
    });
    fixture = TestBed.createComponent(DetailCommandeClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
