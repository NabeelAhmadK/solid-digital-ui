import { Component, OnInit } from '@angular/core'
import { MenuService } from 'src/app/services/menu'
import * as _ from 'lodash'
import { select, Store } from '@ngrx/store'
import * as Reducers from 'src/app/store/reducers'

@Component({
  selector: 'air-topbar-dark-menu-pages',
  templateUrl: './menu-pages.component.html',
  styleUrls: ['./menu-pages.component.scss'],
})
export class TopbarDarkMenuPagesComponent implements OnInit {
  menuData: any = []
  isAdmin: Boolean

  constructor(private menuService: MenuService, private store: Store<any>) {
    this.store.pipe(select(Reducers.getUser)).subscribe(state => {
      this.isAdmin = state.is_admin
    })
  }

  ngOnInit() {
    if (this.isAdmin) {
      this.menuService.getAdminMenuData().subscribe(menuData => (this.menuData = menuData))
    } else {
      this.menuService.getCustomerMenuData().subscribe(menuData => (this.menuData = menuData))
    }
  }
}
