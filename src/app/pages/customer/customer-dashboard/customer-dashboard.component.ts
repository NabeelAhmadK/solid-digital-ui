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
  constructor(private clientService: ClientService) {

  }
  ngOnInit() {

    let userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      this.clientId = userData?.is_contact_person?.client_id
      this.getClient(this.clientId)

    }
  }

  getClient(clientId) {
    let payload = {
      id: this.clientId
    }
    this.clientService.getClientLogo(payload).subscribe(({ data }) => {
      if (data.logo)
        this.url = `${environment.baseUrl}` + data?.logo?.url
    })
  }
}
