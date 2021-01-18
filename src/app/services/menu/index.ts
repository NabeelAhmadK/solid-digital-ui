import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { getAdminMenuData, getCustomerMenuData } from './config'

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor() {}

  getAdminMenuData(): Observable<any[]> {
    return of(getAdminMenuData)
  }

  getCustomerMenuData(): Observable<any[]> {
    return of(getCustomerMenuData)
  }
}
