import { Component, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import * as UserActions from 'src/app/store/user/actions'
import * as Reducers from 'src/app/store/reducers'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'air-topbar-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class TopbarUserMenuComponent implements OnInit {
  badgeCount: number = 7
  name: string = ''
  role: string = ''
  email: string = ''
  profile_image: string = ''
  userData: any;



  constructor(private store: Store<any>) {

  }
  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.name = this.userData.name
    if (this.userData.is_admin) {
      this.role = 'Adminstrator'
    } else {
      this.role = 'Contact Person'
    }
    this.email = this.userData.email
    this.profile_image = `${environment.baseUrl}` + this.userData?.profile_image?.url

  }

  badgeCountIncrease() {
    this.badgeCount = this.badgeCount + 1
  }

  logout() {
    this.store.dispatch(new UserActions.Logout())
  }
}
