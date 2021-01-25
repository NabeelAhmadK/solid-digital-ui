import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { select, Store } from '@ngrx/store'
import * as Reducers from 'src/app/store/reducers'
import * as UserActions from 'src/app/store/user/actions'
import * as SettingsActions from 'src/app/store/settings/actions'
import { NzNotificationService } from 'ng-zorro-antd'
import { map, switchMap, catchError, withLatestFrom, concatMap } from 'rxjs/operators'
import { Router, ActivatedRoute } from '@angular/router'

import { jwtAuthService } from '../../../../services/jwt'

@Component({
  selector: 'cui-system-login',
  templateUrl: './login.component.html',
  styleUrls: ['../style.component.scss'],
})
export class LoginComponent {
  form: FormGroup
  logo: String
  authProvider: string = 'jwt'
  loading: boolean = false

  constructor(private fb: FormBuilder, private store: Store<any>,
    private authService: jwtAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NzNotificationService) {
    localStorage.clear()
    this.form = fb.group({
      email: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required]],
    })
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      this.logo = state.logo
      this.authProvider = state.authProvider
    })
    this.store.pipe(select(Reducers.getUser)).subscribe(state => {
      this.loading = state.loading
    })
  }

  get email() {
    return this.form.controls.email
  }
  get password() {
    return this.form.controls.password
  }

  submitForm(): void {
    this.email.markAsDirty()
    this.email.updateValueAndValidity()
    this.password.markAsDirty()
    this.password.updateValueAndValidity()
    if (this.email.invalid || this.password.invalid) {
      return
    }
    const payload = {
      email: this.email.value,
      password: this.password.value,
    }
    // this.store.dispatch(new UserActions.Login(payload))

    this.authService.login(payload.email, payload.password).
      subscribe(response => {
        if (response && response.data.access_token) {
          localStorage.setItem('accessToken', response.data.access_token)
          localStorage.setItem('userData', JSON.stringify(response.data.user));

          if (response.data.user.is_admin) {
            this.router.navigate(['/pages/client-management/clients'], { replaceUrl: true })
            this.toast.success('Logged In', 'You have successfully logged in!')
          } else {
            this.router.navigate(['/pages/customer/dashboard'], { replaceUrl: true })
            this.toast.success('Logged In', 'You have successfully logged in!')
          }
        } else this.toast.warning('Auth Failed', response.message)
      },
        error => {
          console.log(error)
          this.toast.error('Login Failed', error.error.message)
        })
  }

  setProvider(authProvider) {
    this.store.dispatch(
      new SettingsActions.SetStateAction({
        authProvider,
      }),
    )
  }
}
