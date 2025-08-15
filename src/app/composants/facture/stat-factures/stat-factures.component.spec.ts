import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatFacturesComponent } from './stat-factures.component';

describe('StatFacturesComponent', () => {
  let component: StatFacturesComponent;
  let fixture: ComponentFixture<StatFacturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatFacturesComponent]
    });
    fixture = TestBed.createComponent(StatFacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
