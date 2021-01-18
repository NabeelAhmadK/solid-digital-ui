import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
  Route,
  UrlSegment,
} from '@angular/router'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { select, Store } from '@ngrx/store'
import * as Reducers from 'src/app/store/reducers'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  authorized: boolean
  userObj: any
  role: any

  constructor(private store: Store<any>, public router: Router) {
    this.store.pipe(select(Reducers.getUser)).subscribe(state => {
      this.authorized = state.authorized
      this.userObj = state
      this.role = state.role
    })
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (environment.authenticated) {
      let url: string = state.url
      return this.checkUserLogin(next, url)
    }

    if (this.authorized) {
      let url: string = state.url
      return this.checkUserLogin(next, url)
    } else {
      this.router.navigate(['auth/login'], {
        queryParams: { returnUrl: state.url },
        replaceUrl: false,
      })
      return false
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state)
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    if (this.userObj) {
      const userRole = this.role
      if (route.data.role && route.data.role.indexOf(userRole) === -1) {
        this.router.navigate(['/customer/dashboard'])
        return false
      }
      return true
    }

    this.router.navigate(['/customer/dashboard'])
    return false
  }
}
