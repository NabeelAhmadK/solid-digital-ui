import { Component, OnInit } from '@angular/core'
import { ClientService } from '../../../services/client/index'
import { select, Store } from '@ngrx/store'
import * as UserActions from 'src/app/store/user/actions'
import * as Reducers from 'src/app/store/reducers'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss'],
  providers: [ClientService],
})
export class CustomerDashboardComponent implements OnInit {
  url: any
  clientId: any
  constructor(private clientService: ClientService, private store: Store<any>) {
    this.store.pipe(select(Reducers.getUser)).subscribe(state => {
      this.clientId = state?.is_contact_person?.client_id
    })
  }
  ngOnInit() {
    this.getClient()
  }

  getClient() {
    this.clientService.getClient(this.clientId).subscribe(({ data }) => {
      this.url = `${environment.baseUrl}` + data?.logo?.url
    })
  }
}
