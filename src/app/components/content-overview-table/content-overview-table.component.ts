import { DecimalPipe } from '@angular/common'
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators'
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
export class ContentOverviewTableComponent implements OnInit {
  contents: Array<any> = []
  showLoading: boolean = false
  private _search$ = new Subject<void>()
  private _loading$ = new BehaviorSubject<boolean>(true)
  total$: Observable<number>

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>

  constructor(public contentService: ContentService, private router: Router) {
    this.GetContents()
    this.total$ = contentService.total$
  }
  ngOnInit() {}

  GetContents() {
    this.showLoading = true
    this.contentService.getAllContents().subscribe(
      ({ data }) => {
        this.showLoading = false
        this.contents = data
      },
      err => {
        this.showLoading = false
      },
    )
  }

  onSort({ column, direction }: SortEvent) {
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
    this.showLoading = true
    this.contentService.deleteContent(content_id).subscribe(
      res => {
        this.showLoading = false
        this.GetContents()
      },
      error => {
        this.showLoading = false
      },
    )
  }
}
