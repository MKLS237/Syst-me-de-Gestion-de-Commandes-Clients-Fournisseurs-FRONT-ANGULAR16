import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageForunisseurComponent } from './page-forunisseur.component';

describe('PageForunisseurComponent', () => {
  let component: PageForunisseurComponent;
  let fixture: ComponentFixture<PageForunisseurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageForunisseurComponent]
    });
    fixture = TestBed.createComponent(PageForunisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
