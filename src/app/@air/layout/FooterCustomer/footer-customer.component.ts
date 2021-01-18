import { Component } from '@angular/core'
import { select, Store } from '@ngrx/store'
import * as SettingsActions from 'src/app/store/settings/actions'
import * as Reducers from 'src/app/store/reducers'

@Component({
  selector: 'air-footer-customer',
  templateUrl: './footer-customer.component.html',
  styleUrls: ['./footer-customer.component.scss'],
})
export class FooterCustomerComponent {
  isContentMaxWidth: boolean
  logo: string
  description: string
  currentYear: number = new Date().getFullYear()

  constructor(private store: Store<any>) {
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      this.isContentMaxWidth = state.isContentMaxWidth
      this.logo = state.logo
      this.description = ''
    })
  }
}
