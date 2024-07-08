import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-deudas',
  templateUrl: './registrar-deudas.component.html',
  styleUrls: ['./registrar-deudas.component.css']
})
export class RegistrarDeudasComponent implements OnInit {
  deudaForm: FormGroup;
  submitted = false;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private location: Location,
    private router: Router
  ) {
    this.deudaForm = this.fb.group({
      tipoDeuda: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
      empresa: ['', [Validators.required, Validators.maxLength(50)]],
      monto: ['', [Validators.required, Validators.min(0.01)]],
      fechaVencimiento: ['', Validators.required],
      metodoPago: ['', [Validators.maxLength(20)]],
      periodo: ['', [Validators.maxLength(10)]],
      tasaInteres: ['', [Validators.min(0.01)]],
      plazoMeses: ['', [Validators.min(1)]],
      referenciaServicio: ['']
    });
  }

  ngOnInit(): void {}

  registrarDeuda() {
    this.submitted = true;
    if (this.deudaForm.valid) {
      const deudaData = {
        ...this.deudaForm.value,
        estado: 'PENDIENTE', // Añadir estado por defecto
        tipo: this.deudaForm.value.tipoDeuda // Asegurarse de que el tipo se envía correctamente
      };

      let observable;
      switch (deudaData.tipoDeuda) {
        case 'COMPRA':
          observable = this.authService.registrarDeudaCompra(deudaData);
          break;
        case 'IMPUESTO':
          observable = this.authService.registrarDeudaImpuesto(deudaData);
          break;
        case 'SERVICIO':
          observable = this.authService.registrarDeudaServicio(deudaData);
          break;
        case 'CRONOGRAMA':
          observable = this.authService.registrarDeudaCronograma(deudaData);
          break;
      }

      if (observable) {
        observable.subscribe(
          response => {
            console.log('Deuda registrada con éxito:', response);
            this.successMessage = 'Deuda registrada con éxito';
            this.deudaForm.reset();
            this.submitted = false;
          },
          error => {
            console.error('Error al registrar la deuda:', error);
          }
        );
      }
    }
  }

  goBack() {
    this.location.back();
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login-registro']);
  }

  get formControls() {
    return this.deudaForm.controls;
  }
}
