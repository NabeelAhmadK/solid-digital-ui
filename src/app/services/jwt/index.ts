import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import store from 'store'
import { select, Store } from '@ngrx/store'
import * as Reducers from 'src/app/store/reducers'
@Injectable()
export class jwtAuthService {
  public base_url = environment.baseUrl

  constructor(private http: HttpClient, private storeValue: Store<any>,) { }

  login(email: string, password: string): Observable<any> {
    let params = new URLSearchParams()

    params.append('email', email)
    params.append('password', password)

    let headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
    })

    return this.http.post(this.base_url + '/api/auth/login', params.toString(), {
      headers: headers,
    })
  }

  register(email: string, password: string, name: string): Observable<any> {
    let params = new URLSearchParams()

    params.append('name', name)
    params.append('username', email)
    params.append('password', password)
    params.append('c_password', password)

    let headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
    })

    return this.http.post(this.base_url + '/api/auth/register', params.toString(), {
      headers: headers,
    })
  }

  currentAccount(): Observable<any> {
    const accessToken = store.get('accessToken')
    const params = accessToken
      ? {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
      : {}

    return this.http.get(this.base_url + '/api/auth/account', params)
  }

  logout(): Observable<any> {
    const accessToken = store.get('accessToken')
    const params = accessToken
      ? {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
      : {}

    return this.http.get(this.base_url + '/api/auth/logout', params)
  }

  forgotPassword(payload): Observable<any> {
    let headers = new HttpHeaders({
      'Content-type': 'application/json',
    })

    return this.http.post(this.base_url + '/api/auth/forgot', payload)
  }

  isAuthenticated() {
    if(localStorage.getItem('accessToken') != null) {
      return true;
    }
    return false;
  }

}
