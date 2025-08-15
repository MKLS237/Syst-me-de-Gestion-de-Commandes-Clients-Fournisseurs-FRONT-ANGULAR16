import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFactureClientComponent } from './list-facture-client.component';

describe('ListFactureClientComponent', () => {
  let component: ListFactureClientComponent;
  let fixture: ComponentFixture<ListFactureClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListFactureClientComponent]
    });
    fixture = TestBed.createComponent(ListFactureClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
