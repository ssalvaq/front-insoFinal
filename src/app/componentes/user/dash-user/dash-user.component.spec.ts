import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashUserComponent } from './dash-user.component';

describe('DashUserComponent', () => {
  let component: DashUserComponent;
  let fixture: ComponentFixture<DashUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashUserComponent]
    });
    fixture = TestBed.createComponent(DashUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
