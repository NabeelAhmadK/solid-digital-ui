import { DecimalPipe } from '@angular/common'
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core'
import { Observable } from 'rxjs'
import { ClientService, Client } from '../../../services/client'
import { NzMessageService } from 'ng-zorro-antd/message'
// import { NgbdSortableHeader, SortEvent } from '../../services/client/sortable.directive'
import { Router } from '@angular/router'
@Component({
  selector: 'client-overview',
  templateUrl: './client-overview.component.html',
  styleUrls: ['./client-overview.component.scss'],
  providers: [ClientService, DecimalPipe],
})
export class ClientOverviewComponent implements OnInit {

  page: any = 1
  pageSize: any = 5
  collectionSize: any = 0
  clients: Array<any> = []
  total$: Observable<number>
  showLoading: boolean = false

  constructor(
    public clientService: ClientService,
    private router: Router,
    private toast: NzMessageService,
  ) { }

  ngOnInit() {
    this.GetClients()
  }

  GetClients() {
    this.showLoading = true
    this.clientService.getAllClients().subscribe(({ data }) => {
      this.showLoading = false
      this.collectionSize = data.length
      this.clients = data;
      console.log(this.clients)
    })
  }

  DeleteClient(client_id): void {
    this.clientService.deleteClient(client_id).subscribe(
      res => {
        this.toast.success('Client Deleted Successfully!')
        this.GetClients()
      },
      error => { },
    )
  }
}
