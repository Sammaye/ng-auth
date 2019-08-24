import {NgModule} from '@angular/core'
import {CommonModule} from '../common/common.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {RegisterComponent} from "./register/register.component";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    RegisterComponent
  ],
  providers: [
  ]
})
export class AuthenticationModule {
}
