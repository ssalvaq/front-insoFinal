import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarDeudasComponent } from './registrar-deudas.component';

describe('RegistrarDeudasComponent', () => {
  let component: RegistrarDeudasComponent;
  let fixture: ComponentFixture<RegistrarDeudasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrarDeudasComponent]
    });
    fixture = TestBed.createComponent(RegistrarDeudasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
