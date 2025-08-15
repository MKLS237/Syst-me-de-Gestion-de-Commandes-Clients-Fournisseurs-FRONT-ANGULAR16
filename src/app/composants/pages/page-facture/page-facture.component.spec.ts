import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFactureComponent } from './page-facture.component';

describe('PageFactureComponent', () => {
  let component: PageFactureComponent;
  let fixture: ComponentFixture<PageFactureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageFactureComponent]
    });
    fixture = TestBed.createComponent(PageFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
