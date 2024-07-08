import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRegisterComponent } from './logueo/login-register/login-register.component';
import { DashUserComponent } from './componentes/user/dash-user/dash-user.component';
import { AuthGuard } from './services/user.guard';
import { RegistrarDeudasComponent } from './componentes/user/registrar-deudas/registrar-deudas.component';
import { UserComponent } from './componentes/user/user.component';

const routes: Routes = [
  { path: '', redirectTo: '/login-registro', pathMatch: 'full' },
  { path: 'login-registro', component: LoginRegisterComponent },

  {
    path: 'user', component: UserComponent, canActivate: [AuthGuard],
    children: [
      {path: '',  component: DashUserComponent },
      { path: 'registrar-deuda', component: RegistrarDeudasComponent },
      { path: 'dash-user', component: DashUserComponent }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
