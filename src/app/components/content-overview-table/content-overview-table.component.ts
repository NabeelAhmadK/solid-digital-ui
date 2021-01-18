import { DecimalPipe } from '@angular/common'
import { Component, QueryList, ViewChildren } from '@angular/core'
import { Observable } from 'rxjs'

import { ContentService } from '../../services/content'
import { Content } from '../../services/content'
import { NgbdSortableHeader, SortEvent } from '../../services/content/sortable.directive'
import { Router } from '@angular/router'

@Component({
  selector: 'content-overview-table',
  templateUrl: './content-overview-table.component.html',
  styleUrls: ['./content-overview-table.component.scss'],
  providers: [ContentService, DecimalPipe],
})
export class ContentOverviewTableComponent {
  contents$: Observable<Content[]>
  total$: Observable<number>

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>

  constructor(public contentService: ContentService, private router: Router) {
    this.contents$ = contentService.contents$
    this.total$ = contentService.total$
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = ''
      }
    })

    this.contentService.sortColumn = column
    this.contentService.sortDirection = direction
  }

  editContent(content_id): void {
    this.router.navigate(['/content/edit_content', content_id])
  }

  deleteContent(content_id): void {
    this.contentService.deleteContent(content_id).subscribe(
      res => {
        alert('Content Deleted Successfully!')
        this.contentService.init()
        this.router.navigate(['/content/content_overview'])
      },
      error => {
        console.log(error)
      },
    )
  }
}
