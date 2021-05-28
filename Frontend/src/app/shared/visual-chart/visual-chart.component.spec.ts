import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualChartComponent } from './visual-chart.component';

describe('VisualChartComponent', () => {
  let component: VisualChartComponent;
  let fixture: ComponentFixture<VisualChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
