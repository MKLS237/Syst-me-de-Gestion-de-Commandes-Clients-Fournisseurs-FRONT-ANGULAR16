import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbordComponent } from './tbord.component';

describe('TbordComponent', () => {
  let component: TbordComponent;
  let fixture: ComponentFixture<TbordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TbordComponent]
    });
    fixture = TestBed.createComponent(TbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
