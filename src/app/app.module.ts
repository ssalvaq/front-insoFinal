import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './componentes/user/user.component';
import { LoginRegisterComponent } from './logueo/login-register/login-register.component';
import { AuthService } from '../app/services/auth.service';
import { InterceptorService } from '../app/services/interceptor.service';
import { AuthGuard } from '../app/services/user.guard';
import { DashUserComponent } from './componentes/user/dash-user/dash-user.component';

// Importaciones de Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Importaciones de FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import { RegistrarDeudasComponent } from './componentes/user/registrar-deudas/registrar-deudas.component';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginRegisterComponent,
    DashUserComponent,
    RegistrarDeudasComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule, // Importa BrowserAnimationsModule para Angular Material
    MatSidenavModule,        // Importa MatSidenavModule
    MatToolbarModule,        // Importa MatToolbarModule
    MatIconModule,           // Importa MatIconModule
    MatButtonModule,         // Importa MatButtonModule
    FullCalendarModule,       // Importa FullCalendarModule
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
