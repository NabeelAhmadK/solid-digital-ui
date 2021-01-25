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

export interface Client {
  id: Number
  business_name: String
  street_number: String
  postal_code: String
  city: String
  phone_number: String
  email: String
  contact_person: ContactPerson[]
  logo: any
}

export interface ContactPerson {
  id: number
  client_id: number
  first_name: string
  last_name: string
  email: string
}

interface SearchResult {
  clients: Client[]
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

function sort(clients: Client[], column: string, direction: string): Client[] {
  if (direction === '') {
    return clients
  } else {
    return [...clients].sort((a, b) => {
      const res = compare(a[column], b[column])
      return direction === 'asc' ? res : -res
    })
  }
}

function matches(client: Client, term: string, pipe: PipeTransform) {
  return client.business_name.toLowerCase().includes(term.toLowerCase())
}

const API_URL: string = `${environment.baseUrl}/api/v1`

@Injectable({ providedIn: 'root' })
export class ClientService {
  private _loading$ = new BehaviorSubject<boolean>(true)
  private _search$ = new Subject<void>()
  private _clients$ = new BehaviorSubject<Client[]>([])
  private _total$ = new BehaviorSubject<number>(0)

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  }

  private accessToken
  private headers
  private CLIENTS_DATA

  async init() {
    this.accessToken = store.get('accessToken')
    this.headers = new HttpHeaders()
    this.headers = this.headers.set('Authorization', 'Bearer ' + this.accessToken)
    this.headers = this.headers.set('X-Requested-With', 'XMLHttpRequest')
  }

  constructor(private pipe: DecimalPipe, private http: HttpClient) {
    this.init()
  }

  get clients$() {
    return this._clients$.asObservable()
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

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch)
    this._search$.next()
  }

  getAllClients() {
    let URI = `${API_URL}/clients`
    return this.http.get<CustomResponse>(URI, { headers: this.headers })
  }

  public getClient(id) {
    let URI = `${API_URL}/clients/${id}`
    return this.http.get<CustomResponse>(URI, { headers: this.headers })
  }

  public getClientLogo(payload): Observable<any> {
    let URI = `${API_URL}/clients/logo`
    return this.http.post(URI, payload, { headers: this.headers })
  }


  public saveClient(client) {
    return this.http.post(API_URL + '/clients', client, { headers: this.headers })
  }

  public uploadLogo(logo) {
    return this.http.post(API_URL + '/clients/media', logo, { headers: this.headers })
  }

  public updateClient(payload: any) {
    return this.http.put(`${API_URL}/clients/${payload.id}`, payload, { headers: this.headers })
  }

  public deleteClient(id): Observable<any> {
    return this.http.delete(`${API_URL}/clients/${id}`, { headers: this.headers })
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state

    // 1. sort
    let clients = sort(this.CLIENTS_DATA, sortColumn, sortDirection)

    // 2. filter
    clients = clients.filter(client => matches(client, searchTerm, this.pipe))
    const total = clients.length

    // 3. paginate
    clients = clients.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
    return of({ clients, total })
  }
}
