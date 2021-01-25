import { Component } from '@angular/core'
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent, RouterOutlet } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import * as SettingsActions from 'src/app/store/settings/actions'
import * as Reducers from 'src/app/store/reducers'
import { slideFadeinUp, slideFadeinRight, zoomFadein, fadein } from '../router-animations'

@Component({
  selector: 'layout-main',
  templateUrl: './main.component.html',
  animations: [slideFadeinUp, slideFadeinRight, zoomFadein, fadein],
})

export class LayoutMainComponent {

  settings$: Observable<any>
  menuLayoutType: string
  isContentMaxWidth: boolean
  isAppMaxWidth: boolean
  isGrayBackground: boolean
  isSquaredBorders: boolean
  isCardShadow: boolean
  isBorderless: boolean
  isTopbarFixed: boolean
  isFooterDark: boolean
  isGrayTopbar: boolean
  routerAnimation: string

  constructor(private store: Store<any>, router: Router) {
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      this.menuLayoutType = state.menuLayoutType
      this.isContentMaxWidth = state.isContentMaxWidth
      this.isAppMaxWidth = state.isAppMaxWidth
      this.isGrayBackground = state.isGrayBackground
      this.isSquaredBorders = state.isSquaredBorders
      this.isCardShadow = state.isCardShadow
      this.isBorderless = state.isBorderless
      this.isTopbarFixed = state.isTopbarFixed
      this.isFooterDark = state.isFooterDark
      this.isGrayTopbar = state.isGrayTopbar
      this.routerAnimation = state.routerAnimation
    })

  }


  routeAnimation(outlet: RouterOutlet, animation: string) {
    if (animation === this.routerAnimation) {
      return outlet.isActivated && outlet.activatedRoute.routeConfig.path
    }
  }
}
