import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeStatsComponent } from './commande-stats.component';

describe('CommandeStatsComponent', () => {
  let component: CommandeStatsComponent;
  let fixture: ComponentFixture<CommandeStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommandeStatsComponent]
    });
    fixture = TestBed.createComponent(CommandeStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
