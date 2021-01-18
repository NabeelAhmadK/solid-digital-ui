import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import store from 'store'

@Injectable()
export class jwtAuthService {
  public clientId = '2'
  public clientSecret = 'x8TUWrVllmNe0iomB6XPFspuXmc7wWcj5A1k2O1W'
  public scope = ''
  public grant_type = 'password'
  public base_url = 'http://localhost:8000'

  constructor(private http: HttpClient) {}

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
}
