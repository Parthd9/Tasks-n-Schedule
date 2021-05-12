import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtaskcompletionComponent } from './subtaskcompletion.component';

describe('SubtaskcompletionComponent', () => {
  let component: SubtaskcompletionComponent;
  let fixture: ComponentFixture<SubtaskcompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtaskcompletionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtaskcompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
