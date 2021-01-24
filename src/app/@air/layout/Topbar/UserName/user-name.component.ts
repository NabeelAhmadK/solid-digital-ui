import { Component } from '@angular/core'
import { select, Store } from '@ngrx/store'
import * as UserActions from 'src/app/store/user/actions'
import * as Reducers from 'src/app/store/reducers'

@Component({
  selector: 'air-topbar-user-name',
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.scss'],
})
export class TopbarUserNameComponent {
  user_name: string = ''

  constructor(private store: Store<any>) {
    let userObj = JSON.parse(localStorage.getItem('userData'));
    this.user_name = userObj.name;
  }
}
