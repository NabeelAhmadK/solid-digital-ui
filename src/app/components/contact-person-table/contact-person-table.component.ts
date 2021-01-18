import { DecimalPipe } from '@angular/common'
import { Component, QueryList, ViewChildren, OnInit, Input } from '@angular/core'
import { Observable } from 'rxjs'

import { NgbdSortableHeader, SortEvent } from '../../services/contact-person/sortable.directive'

import { ContactPerson, ContactPersonService } from '../../services/contact-person'

import { Router } from '@angular/router'

@Component({
  selector: 'contact-person-table',
  templateUrl: './contact-person-table.component.html',
  styleUrls: ['./contact-person-table.component.scss'],
  providers: [ContactPersonService, DecimalPipe],
})
export class ContactPersonTableComponent {
  contact_persons$: Observable<ContactPerson[]>
  total$: Observable<number>

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>

  @Input() client_id: number

  constructor(public contactPersonService: ContactPersonService, private router: Router) {
    this.contact_persons$ = contactPersonService.contact_persons$
    this.total$ = contactPersonService.total$
  }

  editContactPerson(cp_id): void {
    this.router.navigate(['/client/edit_contact_person', cp_id])
  }

  deleteContactPerson(cp_id): void {
    this.contactPersonService.deleteContactPerson(cp_id).subscribe(
      res => {
        alert('Contact Person Deleted Successfully!')
        this.contactPersonService.init()
        this.router.navigate(['/'])
      },
      error => {
        console.log(error)
      },
    )
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = ''
      }
    })

    this.contactPersonService.sortColumn = column
    this.contactPersonService.sortDirection = direction
  }
}
