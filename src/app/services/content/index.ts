import { Injectable, PipeTransform, ɵConsole } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BehaviorSubject, Observable, of, Subject } from 'rxjs'
import { map } from 'rxjs/operators'
import store from 'store'
import { environment } from 'src/environments/environment'
import { DecimalPipe } from '@angular/common'
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators'
import { SortDirection } from './sortable.directive'
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar'
import { json } from 'd3'

export interface Content {
  id: Number
  name: String
  type: String
  subject: String
  html: String
}

interface SearchResult {
  contents: Content[]
  total: number
}

interface CustomResponse {
  data: any
}

interface State {
  page: number
  pageSize: number
  searchTerm: string
  sortColumn: string
  sortDirection: SortDirection
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0
}

function sort(contents: Content[], column: string, direction: string): Content[] {
  if (direction === '') {
    return contents
  } else {
    return [...contents].sort((a, b) => {
      const res = compare(a[column], b[column])
      return direction === 'asc' ? res : -res
    })
  }
}

function matches(content: Content, term: string, pipe: PipeTransform) {
  return content.name.toLowerCase().includes(term.toLowerCase())
}

const API_URL: string = `${environment.baseUrl}/api/v1`

@Injectable({ providedIn: 'root' })
export class ContentService {
  private _loading$ = new BehaviorSubject<boolean>(true)
  private _search$ = new Subject<void>()
  _contents$ = new BehaviorSubject<Content[]>([])
  _total$ = new BehaviorSubject<number>(0)

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  }

  private accessToken
  private headers
  private CONTENTS_DATA

  async init() {
    this.accessToken = store.get('accessToken')
    this.headers = new HttpHeaders()
    this.headers = this.headers.set('Authorization', 'Bearer ' + this.accessToken)
  }

  constructor(private pipe: DecimalPipe, private http: HttpClient) {
    this.init()
  }

  get contents$() {
    return this._contents$.asObservable()
  }
  get total$() {
    return this._total$.asObservable()
  }
  get loading$() {
    return this._loading$.asObservable()
  }
  get page() {
    return this._state.page
  }
  get pageSize() {
    return this._state.pageSize
  }
  get searchTerm() {
    return this._state.searchTerm
  }

  set page(page: number) {
    this._set({ page })
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize })
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm })
  }
  set sortColumn(sortColumn: string) {
    this._set({ sortColumn })
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection })
  }

  _set(patch: Partial<State>) {
    Object.assign(this._state, patch)
    this._search$.next()
  }

  getAllContents() {
    let URI = `${API_URL}/contents`
    return this.http.get<CustomResponse>(URI, { headers: this.headers })
  }

  public getContent(id) {
    let URI = `${API_URL}/contents/${id}`
    return this.http.get<CustomResponse>(URI, { headers: this.headers })
  }

  public addContent(content) {
    return this.http.post(API_URL + '/contents', content, { headers: this.headers })
  }

  public updateContent(content, id) {
    return this.http.put(`${API_URL}/contents/${id}`, content, { headers: this.headers })
  }

  public deleteContent(id): Observable<any> {
    return this.http.delete(`${API_URL}/contents/${id}`, { headers: this.headers })
  }

  _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state

    // 1. sort
    let contents = sort(this.CONTENTS_DATA, sortColumn, sortDirection)

    // 2. filter
    contents = contents.filter(content => matches(content, searchTerm, this.pipe))
    const total = contents.length

    // 3. paginate
    contents = contents.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
    return of({ contents, total })
  }
}
