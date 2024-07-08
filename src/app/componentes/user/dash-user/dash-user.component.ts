import { Component, OnInit } from '@angular/core';
import { AuthService, CronogramaPagoDTO } from '../../../services/auth.service';
import { Router } from '@angular/router';

export interface Deuda {
  id: number;
  numeroDocumento: string;
  empresa: string;
  monto: number;
  fechaVencimiento: string;
  estado: string;
  tipo: string;
  cronogramaPagos?: CronogramaPagoDTO[];
  cuota?: number;
}

@Component({
  selector: 'app-dash-user',
  templateUrl: './dash-user.component.html',
  styleUrls: ['./dash-user.component.css']
})
export class DashUserComponent implements OnInit {
  currentMonth: number = new Date().getMonth() + 1;
  currentYear: number = new Date().getFullYear();
  debts: Deuda[] = [];
  cronograma: CronogramaPagoDTO[] = [];
  todayDebts: Deuda[] = [];
  monthName: string = this.getMonthName(this.currentMonth - 1);
  hasNotifications: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadDebts();
    this.loadCronograma(this.currentMonth, this.currentYear);
    this.loadTodayDebts();
  }

  getMonthName(month: number): string {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return monthNames[month];
  }

  previousMonth() {
    if (this.currentMonth > 1) {
      this.currentMonth--;
    } else {
      this.currentMonth = 12;
      this.currentYear--;
    }
    this.monthName = this.getMonthName(this.currentMonth - 1);
    this.loadDebts();
    this.loadCronograma(this.currentMonth, this.currentYear);
  }

  nextMonth() {
    if (this.currentMonth < 12) {
      this.currentMonth++;
    } else {
      this.currentMonth = 1;
      this.currentYear++;
    }
    this.monthName = this.getMonthName(this.currentMonth - 1);
    this.loadDebts();
    this.loadCronograma(this.currentMonth, this.currentYear);
  }

  goToToday() {
    const today = new Date();
    this.currentMonth = today.getMonth() + 1;
    this.currentYear = today.getFullYear();
    this.monthName = this.getMonthName(this.currentMonth - 1);
    this.loadDebts();
    this.loadCronograma(this.currentMonth, this.currentYear);
  }

  loadDebts() {
    this.authService.obtenerDeudas(this.currentMonth, this.currentYear).subscribe((debts: Deuda[]) => {
      this.debts = this.filterDebts(debts);
    });
  }

  loadCronograma(month: number, year: number) {
    this.authService.obtenerCronograma().subscribe((cronograma: CronogramaPagoDTO[]) => {
      this.cronograma = this.filterCronograma(cronograma, month, year);
    });
  }

  loadTodayDebts() {
    this.authService.obtenerDeudasQueVencenHoy().subscribe((debts: Deuda[]) => {
      this.todayDebts = debts;
      this.hasNotifications = this.todayDebts.length > 0;
    });
  }

  filterDebts(debts: Deuda[]): Deuda[] {
    const uniqueDebts = new Map<number, Deuda>();

    debts.forEach(debt => {
      const dueDate = new Date(debt.fechaVencimiento);
      const debtMonth = dueDate.getMonth() + 1;
      const debtYear = dueDate.getFullYear();

      if (debtMonth === this.currentMonth && debtYear === this.currentYear) {
        uniqueDebts.set(debt.id, debt);
      }
    });

    return Array.from(uniqueDebts.values());
  }

  filterCronograma(cronograma: CronogramaPagoDTO[], month: number, year: number): CronogramaPagoDTO[] {
    return cronograma.filter(cron => {
      const dueDate = new Date(cron.fechaVencimiento);
      return dueDate.getMonth() + 1 === month && dueDate.getFullYear() === year;
    });
  }

  getDebtCardClass(debt: Deuda | CronogramaPagoDTO): string {
    const today = new Date();
    const dueDate = new Date(debt.fechaVencimiento);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    if (debt.estado === 'PAGADA') {
      return 'bg-success'; // Verde
    } else if (dueDate < today) {
      return 'bg-danger'; // Rojo
    } else if (dueDate >= today && dueDate <= nextWeek) {
      return 'bg-warning'; // Amarillo
    } else {
      return 'bg-dark'; // Negro
    }
  }

  marcarComoPagada(debtId: number) {
    this.authService.marcarDeudaComoPagada(debtId).subscribe(response => {
      this.debts = this.debts.map(debt => {
        if (debt.id === debtId) {
          return response; // Reemplaza la deuda actualizada en la lista
        }
        return debt;
      });
      this.todayDebts = this.todayDebts.filter(debt => debt.id !== debtId);
      this.hasNotifications = this.todayDebts.length > 0;
      this.loadCronograma(this.currentMonth, this.currentYear);
    });
  }

  marcarPagoCronogramaComoPagado(cronogramaId: number) {
    if (cronogramaId) {
      this.authService.marcarCronogramaComoPagado(cronogramaId).subscribe(response => {
        this.cronograma = this.cronograma.map(cron => {
          if (cron.id === cronogramaId) {
            return { ...cron, estado: 'PAGADA' }; // Actualiza el estado del cronograma
          }
          return cron;
        });
      });
    } else {
      console.error('Invalid cronogramaId:', cronogramaId);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login-registro']);
  }

  navigateToRegisterDebt() {
    this.router.navigate(['/user/registrar-deuda']);
  }
}
