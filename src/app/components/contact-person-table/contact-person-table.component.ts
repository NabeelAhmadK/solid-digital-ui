import { DecimalPipe } from '@angular/common'
import { Component, QueryList, ViewChildren, OnInit, Input } from '@angular/core'
import { Observable } from 'rxjs'

import { NzMessageService } from 'ng-zorro-antd/message'

import { NgbdSortableHeader, SortEvent } from '../../services/contact-person/sortable.directive'

import { ContactPerson, ContactPersonService } from '../../services/contact-person'

import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'contact-person-table',
  templateUrl: './contact-person-table.component.html',
  styleUrls: ['./contact-person-table.component.scss'],
  providers: [ContactPersonService, DecimalPipe],
})
export class ContactPersonTableComponent implements OnInit {
  contact_persons$: Observable<ContactPerson[]>
  contactPersons: Array<any> = []
  total$: Observable<number>

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>

  client_id: any

  constructor(
    public contactPersonService: ContactPersonService,
    private router: Router,
    private msg: NzMessageService,
    private route: ActivatedRoute,
  ) {
    this.contact_persons$ = contactPersonService.contact_persons$
    this.total$ = contactPersonService.total$

    this.route.params.subscribe(param => {
      if (param.id) {
        this.client_id = param.id
        this.GetContactPersons(this.client_id)
      }
    })
  }

  ngOnInit() {}

  GetContactPersons(clientId) {
    let all_contact_persons
    this.contactPersonService.getAllContactPersons().subscribe(({ data }) => {
      this.contactPersons = data.filter(function(cp) {
        return cp.client_id == clientId
      })
    })
  }

  editContactPerson(cp_id): void {
    this.router.navigate(['/client/edit_contact_person', cp_id])
  }

  deleteContactPerson(cp_id): void {
    this.contactPersonService.deleteContactPerson(cp_id).subscribe(
      res => {
        this.msg.success('Contact Person Deleted Successfully!')
        this.contactPersonService.init()
        this.router.navigate(['/client/client_overview'])
      },
      error => {},
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
