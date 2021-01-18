import { DecimalPipe } from '@angular/common'
import { Component, QueryList, ViewChildren } from '@angular/core'
import { Observable } from 'rxjs'

import { ClientService } from '../../services/client'

import { Client } from '../../services/client'

import { NgbdSortableHeader, SortEvent } from '../../services/client/sortable.directive'

import { Router } from '@angular/router'

@Component({
  selector: 'client-overview-table',
  templateUrl: './client-overview-table.component.html',
  styleUrls: ['./client-overview-table.component.scss'],
  providers: [ClientService, DecimalPipe],
})
export class ClientOverviewTableComponent {
  clients$: Observable<Client[]>
  total$: Observable<number>

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>

  constructor(public clientService: ClientService, private router: Router) {
    this.clients$ = clientService.clients$
    this.total$ = clientService.total$
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

  editClient(client_id): void {
    this.router.navigate(['/client/edit_client', client_id])
  }

  deleteClient(client_id): void {
    this.clientService.deleteClient(client_id).subscribe(
      res => {
        alert('Client Deleted Successfully!')
        this.clientService.init()
        this.router.navigate(['/'])
      },
      error => {
        console.log(error)
      },
    )
  }
}
