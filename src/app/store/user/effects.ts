import { Injectable } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Actions, Effect, ofType, OnInitEffects } from '@ngrx/effects'
import { Action, select, Store } from '@ngrx/store'
import { Observable, of, empty, from } from 'rxjs'
import { map, switchMap, catchError, withLatestFrom, concatMap } from 'rxjs/operators'
import store from 'store'
import { NzNotificationService } from 'ng-zorro-antd'

import * as Reducers from 'src/app/store/reducers'
import * as UserActions from './actions'
import { jwtAuthService } from 'src/app/services/jwt'

@Injectable()
export class UserEffects implements OnInitEffects {
  constructor(
    private actions: Actions,
    private jwtAuthService: jwtAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private rxStore: Store<any>,
    private notification: NzNotificationService,
  ) {}

  ngrxOnInitEffects(): Action {
    return { type: UserActions.LOAD_CURRENT_ACCOUNT }
  }

  @Effect()
  login: Observable<any> = this.actions.pipe(
    ofType(UserActions.LOGIN),
    map((action: UserActions.Login) => action.payload),
    concatMap(action =>
      of(action).pipe(withLatestFrom(this.rxStore.pipe(select(Reducers.getSettings)))),
    ),
    switchMap(([payload, settings]) => {
      // jwt login
      if (settings.authProvider === 'jwt') {
        return this.jwtAuthService.login(payload.email, payload.password).pipe(
          map(response => {
            if (response && response.data.access_token) {
              store.set('accessToken', response.data.access_token)
              this.notification.success('Logged In', 'You have successfully logged in!')

              if (response.data.user.is_admin) {
                this.router.navigate(['/client/client_overview'], { replaceUrl: true })
              } else {
                this.router.navigate(['/customer/dashboard'], { replaceUrl: true })
              }
              return new UserActions.LoadCurrentAccount()
            }
            this.notification.warning('Auth Failed', response.message)
            return new UserActions.LoginUnsuccessful()
          }),
          catchError(error => {
            this.notification.error('Login Failed', 'Invalid Credentials!')
            return from([{ type: UserActions.LOGIN_UNSUCCESSFUL }])
          }),
        )
      }
    }),
  )

  @Effect()
  register: Observable<any> = this.actions.pipe(
    ofType(UserActions.REGISTER),
    map((action: UserActions.Register) => action.payload),
    concatMap(action =>
      of(action).pipe(withLatestFrom(this.rxStore.pipe(select(Reducers.getSettings)))),
    ),
    switchMap(([payload, settings]) => {
      // jwt register
      if (settings.authProvider === 'jwt') {
        return this.jwtAuthService.register(payload.email, payload.password, payload.name).pipe(
          map(response => {
            if (response && response.id) {
              if (response.accessToken) {
                store.set('accessToken', response.accessToken)
              }
              this.router.navigate(['/'])
              return new UserActions.RegisterSuccessful(response)
            }
            this.notification.warning('Registration Failed', response)
            return new UserActions.RegisterUnsuccessful()
          }),
          catchError(error => {
            return from([{ type: UserActions.LOGIN_UNSUCCESSFUL }])
          }),
        )
      }
    }),
  )

  @Effect()
  loadCurrentAccount: Observable<any> = this.actions.pipe(
    ofType(UserActions.LOAD_CURRENT_ACCOUNT),
    map((action: UserActions.LoadCurrentAccount) => true),
    concatMap(action =>
      of(action).pipe(withLatestFrom(this.rxStore.pipe(select(Reducers.getSettings)))),
    ),
    switchMap(([action, settings]) => {
      // jwt load current account
      if (settings.authProvider === 'jwt') {
        return this.jwtAuthService.currentAccount().pipe(
          map(response => {
            if (response && (response.email || response.user)) {
              if (this.route.snapshot.queryParams.returnUrl) {
                this.router.navigate([this.route.snapshot.queryParams.returnUrl]) // // redirect to returnUrl
              } else if (this.router.url.includes('/auth')) {
                this.router.navigate(['/']) // redirect to root route on auth pages
              }
              return new UserActions.LoadCurrentAccountSuccessful(response)
            }
            return new UserActions.LoadCurrentAccountUnsuccessful()
          }),
          catchError(error => {
            return from([{ type: UserActions.LOGIN_UNSUCCESSFUL }])
          }),
        )
      }

      // do nothing for firebase, as user state subscribed inside firebase service
      return of(new UserActions.EmptyAction())
    }),
  )

  @Effect()
  logout: Observable<any> = this.actions.pipe(
    ofType(UserActions.LOGOUT),
    map((action: UserActions.Logout) => true),
    concatMap(action =>
      of(action).pipe(withLatestFrom(this.rxStore.pipe(select(Reducers.getSettings)))),
    ),
    switchMap(([, settings]) => {
      // jwt logout
      if (settings.authProvider === 'jwt') {
        return this.jwtAuthService.logout().pipe(
          map(() => {
            store.remove('accessToken')
            this.notification.success('Logged Out', 'You have successfully logged out!')
            this.router.navigate(['/auth/login'])
            return new UserActions.FlushUser()
          }),
        )
      }
    }),
  )
}
