import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertUserComponent } from './upsert-user.component';

describe('UpsertUserComponent', () => {
  let component: UpsertUserComponent;
  let fixture: ComponentFixture<UpsertUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
