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

export interface ContactPerson {
  id: number
  client_id: number
  first_name: string
  last_name: string
  email: string
  mobile_number: any
  is_account_active: any
  send_email_invite: any
  profile_image: any
}

interface SearchResult {
  contact_persons: ContactPerson[]
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

function sort(
  contact_persons: ContactPerson[],
  column: string,
  direction: string,
): ContactPerson[] {
  if (direction === '') {
    return contact_persons
  } else {
    return [...contact_persons].sort((a, b) => {
      const res = compare(a[column], b[column])
      return direction === 'asc' ? res : -res
    })
  }
}

function matches(contact_person: ContactPerson, term: string, pipe: PipeTransform) {
  return contact_person.first_name.toLowerCase().includes(term.toLowerCase())
}

const API_URL: string = `${environment.baseUrl}/api/v1`

const AUTH_API_URL: string = `${environment.baseUrl}/api/auth`

@Injectable({ providedIn: 'root' })
export class ContactPersonService {
  private _loading$ = new BehaviorSubject<boolean>(true)
  private _search$ = new Subject<void>()
  private _contact_persons$ = new BehaviorSubject<ContactPerson[]>([])
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
  private CONTACT_PERSONS_DATA

  async init() {
    this.accessToken = store.get('accessToken')
    this.headers = new HttpHeaders()
    this.headers = this.headers.set('Authorization', 'Bearer ' + this.accessToken)

    this.getAllContactPersons().subscribe(response => {
      this.CONTACT_PERSONS_DATA = response.data
    })
  }

  constructor(private pipe: DecimalPipe, private http: HttpClient) {
    this.init()
  }

  get contact_persons$() {
    return this._contact_persons$.asObservable()
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

  public getAllContactPersons(): Observable<any> {
    let URI = `${API_URL}/contact-people`
    return this.http.get<CustomResponse>(URI, { headers: this.headers })
  }

  public getContactPersonsWithClientId(client_id) {
    let all_contact_persons
    let contact_persons_wrt_client_id

    this.getAllContactPersons().subscribe(response => {
      all_contact_persons = response.data

      contact_persons_wrt_client_id = all_contact_persons.filter(function(cp) {
        return cp.client_id == client_id
      })
    })

    return contact_persons_wrt_client_id
  }

  public getContactPerson(id) {
    let URI = `${API_URL}/contact-people/${id}`
    return this.http.get<CustomResponse>(URI, { headers: this.headers })
  }

  public addContactPerson(contact_person) {
    return this.http.post(API_URL + '/contact-people', contact_person, { headers: this.headers })
  }

  public registerUserAccount(user_account) {
    return this.http.post<CustomResponse>(AUTH_API_URL + '/register', user_account, {
      headers: this.headers,
    })
  }

  public uploadProfileImage(profile_image) {
    return this.http.post(API_URL + '/users/media', profile_image, {
      headers: this.headers,
    })
  }
  public updateProfileImage(profile_image, id) {
    return this.http.put(API_URL + `/users/${id}`, profile_image, {
      headers: this.headers,
    })
  }

  public updateContactPerson(contact_person, id) {
    return this.http.put(`${API_URL}/contact-people/${id}`, contact_person, {
      headers: this.headers,
    })
  }

  public deleteContactPerson(id): Observable<any> {
    return this.http.delete(`${API_URL}/contact-people/${id}`, { headers: this.headers })
  }

  getUserbyId(id): Observable<any> {
    return this.http.get(`${API_URL}/users/${id}`, { headers: this.headers })
  }
  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state

    // 1. sort
    let contact_persons = sort(this.CONTACT_PERSONS_DATA, sortColumn, sortDirection)

    // 2. filter
    contact_persons = contact_persons.filter(contact_person =>
      matches(contact_person, searchTerm, this.pipe),
    )
    const total = contact_persons.length

    // 3. paginate
    contact_persons = contact_persons.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
    return of({ contact_persons, total })
  }
}
