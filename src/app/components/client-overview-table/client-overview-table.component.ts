import { DecimalPipe } from '@angular/common'
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core'
import { Observable } from 'rxjs'

import { ClientService } from '../../services/client'

import { Client } from '../../services/client'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NgbdSortableHeader, SortEvent } from '../../services/client/sortable.directive'

import { Router } from '@angular/router'

@Component({
  selector: 'client-overview-table',
  templateUrl: './client-overview-table.component.html',
  styleUrls: ['./client-overview-table.component.scss'],
  providers: [ClientService, DecimalPipe],
})
export class ClientOverviewTableComponent implements OnInit {
  clients: Array<any> = []
  total$: Observable<number>
  showLoading: boolean = false

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>

  constructor(
    public clientService: ClientService,
    private router: Router,
    private toast: NzMessageService,
  ) {
    this.total$ = clientService.total$
  }
  ngOnInit() {
    this.getClient()
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = ''
      }
    })

    this.clientService.sortColumn = column
    this.clientService.sortDirection = direction
  }

  getClient() {
    this.showLoading = true
    this.clientService.getAllClients().subscribe(({ data }) => {
      this.showLoading = false
      this.clients = data
    })
  }

  deleteClient(client_id): void {
    this.clientService.deleteClient(client_id).subscribe(
      res => {
        this.toast.success('Client Deleted Successfully!')
        this.getClient()
      },
      error => {},
    )
  }
}
