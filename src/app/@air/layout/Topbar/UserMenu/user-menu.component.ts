import { Component } from '@angular/core'
import { select, Store } from '@ngrx/store'
import * as UserActions from 'src/app/store/user/actions'
import * as Reducers from 'src/app/store/reducers'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'air-topbar-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class TopbarUserMenuComponent {
  badgeCount: number = 7
  name: string = ''
  role: string = ''
  email: string = ''
  profile_image: string = ''



  constructor(private store: Store<any>) {
    this.store.pipe(select(Reducers.getUser)).subscribe(state => {
      this.name = state.name
      if (state.is_admin) {
        this.role = 'Adminstrator'
      } else {
        this.role = 'Contact Person'
      }
      this.email = state.email
      this.profile_image = `${environment.baseUrl}` + state?.profile_image?.url
    })
  }

  badgeCountIncrease() {
    this.badgeCount = this.badgeCount + 1
  }

  logout() {
    this.store.dispatch(new UserActions.Logout())
  }
}
