import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FullLayoutComponent} from './layouts/full-layout.component';
import {AuthGaurdService} from './auth-gaurd.service';
import {LoginComponent} from './authentication/login/login.component';
import {LogoutComponent} from './authentication/logout/logout.component';
import {ChangePasswordComponent} from './authentication/change-password/change-password.component';
import {ForgotPasswordComponent} from './authentication/forgot-password/forgot-password.component';
import {RegisterComponent} from './authentication/register/register.component';

export const AppRoutes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'home', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: 'admin/login',
    component: LoginComponent,
    canActivate: [AuthGaurdService],
    data: {requireAuth: false},
  },
  {
    path: 'admin/logout',
    component: LogoutComponent,
    canActivate: [AuthGaurdService],
    data: {requireAuth: false},
  },
  {
    path: 'admin/changePassword',
    component: ChangePasswordComponent,
    canActivate: [AuthGaurdService],
    data: {requireAuth: false},
  },
  {
    path: 'admin/forgotPassword',
    component: ForgotPasswordComponent,
    canActivate: [AuthGaurdService],
    data: {requireAuth: false},
  },
  {
    path: 'user/login',
    component: LoginComponent,
    canActivate: [AuthGaurdService],
    data: {requireAuth: false},
  },
  {
    path: 'user/logout',
    component: LogoutComponent,
    canActivate: [AuthGaurdService],
    data: {requireAuth: false},
  },
  {
    path: 'user/changePassword',
    component: ChangePasswordComponent,
    canActivate: [AuthGaurdService],
    data: {requireAuth: false},
  },
  {
    path: 'user/forgotPassword',
    component: ForgotPasswordComponent,
    canActivate: [AuthGaurdService],
    data: {requireAuth: false},
  },
  {
    path: 'user/register',
    component: RegisterComponent,
    canActivate: [AuthGaurdService],
    data: {requireAuth: false},
  },
  {
    path: 'user',
    component: FullLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule),
        canActivate: [AuthGaurdService],
        data: {requireAuth: true},
      },
    ]
  },
  {path: '**', redirectTo: '/company/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes)],
  declarations: [],
  providers: [
    AuthGaurdService
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
