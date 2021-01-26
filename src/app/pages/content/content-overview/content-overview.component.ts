import { DecimalPipe } from '@angular/common'
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators'
import { ContentService, Content } from '../../../services/content'
import { Router } from '@angular/router'
@Component({
  selector: 'content-overview',
  templateUrl: './content-overview.component.html',
  styleUrls: ['./content-overview.component.scss'],
  providers: [ContentService, DecimalPipe],
})
export class ContentOverviewComponent implements OnInit {

  page: any = 1
  pageSize: any = 5
  collectionSize: any = 0
  contents: Array<any> = []
  showLoading: boolean = false

  constructor(
    public contentService: ContentService,
    private router: Router
  ) { }


  ngOnInit() {
    this.GetContents()
  }

  GetContents() {
    this.showLoading = true
    this.contentService.getAllContents().subscribe(
      ({ data }) => {
        this.showLoading = false
        this.contents = data
        this.collectionSize = this.contents.length;
      },
      err => {
        this.showLoading = false
      },
    )
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
