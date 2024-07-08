// auth.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import baserUrl from './helper';

export interface CronogramaPagoDTO {
  id: number;
  numeroPago: number;
  fechaVencimiento: string;
  saldo: number;
  capital: number;
  interes: number;
  cuota: number;
  empresa: string;
  tipoDeuda: string;
  estado: string;
  numeroDocumento: string;  // Añadir estas propiedades
  monto: number;            // Añadir estas propiedades
  cronogramaPagos?: CronogramaPagoDTO[];
}


interface JwtPayload {
  id: number;
  correo: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserRole = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  public login(correo: string, password: string): Observable<any> {
    const loginData = { correo, password };
    return this.http.post(`${baserUrl}/usuarios/login`, loginData).pipe(
      map((response: any) => {
        const token = response.token;
        this.setToken(token);
        const decodedToken = jwtDecode<JwtPayload>(token); // Decodificar como JwtPayload
        this.currentUserRole.next(decodedToken.role); // Usar el role del token
        return response;
      })
    );
  }

  // Método para registrar un nuevo usuario
  public register(user: any): Observable<any> {
    return this.http.post(`${baserUrl}/usuarios/register`, user);
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);
    this.checkToken(); // Verifica el token inmediatamente después de establecerlo
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.currentUserRole.next('');
  }

  public getRole(): Observable<string> {
    return this.currentUserRole.asObservable();
  }

  private checkToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        this.currentUserRole.next(decodedToken.role);
        this.loggedIn.next(true);
      } catch (error) {
        console.error('Failed to decode token:', error);
        this.logout(); // Considera cerrar la sesión si el token no es válido
      }
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getUsuarioId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const decoded: any = jwtDecode(token);
    return decoded.userId;  // Usa 'userId' como en la estructura de tu token
  }

  public obtenerDeudas(month: number, year: number): Observable<any> {
    return this.http.get(`${baserUrl}/deudas/consultar`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      },
      params: {
        month: month.toString(),
        year: year.toString()
      }
    });
  }

  public obtenerDeudasQueVencenHoy(): Observable<any> {
    return this.http.get(`${baserUrl}/deudas/vencen-hoy`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });
  }

  public registrarDeudaCompra(deuda: any): Observable<any> {
    return this.http.post(`${baserUrl}/deudas/registrar/compra`, deuda, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });
  }

  public registrarDeudaImpuesto(deuda: any): Observable<any> {
    return this.http.post(`${baserUrl}/deudas/registrar/impuesto`, deuda, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });
  }

  registrarDeudaServicio(deudaData: any): Observable<any> {
    return this.http.post(`${baserUrl}/deudas/registrar/servicio`, deudaData, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });
  }

  public marcarDeudaComoPagada(deudaId: number): Observable<any> {
    return this.http.post(`${baserUrl}/deudas/marcar-pagada/${deudaId}`, {}, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });
  }

  public registrarDeudaCronograma(deuda: any): Observable<any> {
    return this.http.post(`${baserUrl}/deudas/registrar/cronograma`, deuda, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });
  }

  obtenerCronograma(): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.get(`${baserUrl}/deudas/cronograma`, { headers });
  }
  // Método para marcar un cronograma como pagado
  marcarCronogramaComoPagado(id: number): Observable<CronogramaPagoDTO> {
    const url = `${baserUrl}/deudas/marcar-pagada-cronograma/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
    return this.http.post<CronogramaPagoDTO>(url, {}, { headers });
  }
}
