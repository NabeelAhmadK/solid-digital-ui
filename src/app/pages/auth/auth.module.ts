import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { AuthRouterModule } from './auth-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SystemModule } from 'src/app/@air/system/system.module'

// system pages
import { LoginPage } from './login/login.component'
import { RegisterPage } from './register/register.component'
import { LockscreenPage } from './lockscreen/lockscreen.component'
import { ForgotPasswordPage } from './forgot-password/forgot-password.component'
import { Error500Page } from './500/500.component'
import { Error404Page } from './404/404.component'
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { ResetPasswordComponent } from './reset-password/confirm-account.component'
import { ConfirmAccountFormComponent } from 'src/app/components/confirm-account-form/confirm-account-form.component'

const COMPONENTS = [
  LoginPage,
  RegisterPage,
  LockscreenPage,
  ForgotPasswordPage,
  Error500Page,
  ResetPasswordComponent,
  Error404Page,
  ConfirmAccountComponent,
  ConfirmAccountComponent,
  ConfirmAccountFormComponent,
]

@NgModule({
  imports: [SharedModule, AuthRouterModule, FormsModule, ReactiveFormsModule, SystemModule],
  declarations: [...COMPONENTS],
})
export class AuthModule {}
