import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
  Route,
  UrlSegment,
  CanActivateChild,
  CanLoad,
  Resolve,
} from '@angular/router'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { select, Store } from '@ngrx/store'
import * as Reducers from 'src/app/store/reducers'
import { jwtAuthService } from '../../../services/jwt'
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivateChild, CanActivate, Resolve<any> {
  authorized: boolean
  userObj: any
  role: any

  constructor(private authService: jwtAuthService, public router: Router) {
  }

  canLoad(route: Route, segments: UrlSegment[],): boolean | Observable<boolean> | Promise<boolean> {


    let userObj = JSON.parse(localStorage.getItem('userData'));
    let routeRole = route.data.role;
    let userRole = userObj.is_admin ? 'Admin' : 'Contact';

    if (routeRole == userRole) return true;
    else if(routeRole == 'All') return true;
    else {
      this.router.navigate(['/404'], {
        replaceUrl: true
      })
      return false
    }
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    throw new Error('Method not implemented.')
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    if (this.authService.isAuthenticated()) return true;
    else {
      console.log('Not authenticated, redirecting and adding redirect url...');
      this.router.navigate(['/auth/login'], {
        queryParams: { redirect: state.url },
        replaceUrl: true,
      });
      return false;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if (this.authService.isAuthenticated()) return true;
    else {
      console.log('Not authenticated, redirecting and adding redirect url...');
      this.router.navigate(['/auth/login'], {
        queryParams: { redirect: state.url },
        replaceUrl: true,
      });
      return false;
    }
  }
}
