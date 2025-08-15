import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageClientComponent } from './page-client.component';

describe('PageClientComponent', () => {
  let component: PageClientComponent;
  let fixture: ComponentFixture<PageClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageClientComponent]
    });
    fixture = TestBed.createComponent(PageClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
