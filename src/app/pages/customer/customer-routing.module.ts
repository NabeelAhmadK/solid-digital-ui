import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from 'src/app/@air/system/Guard/auth.guard'
import { LayoutsModule } from 'src/app/layouts/layouts.module'

// customer module components

import { CustomerDashboardComponent } from 'src/app/pages/customer/customer-dashboard/customer-dashboard.component'

const routes: Routes = [
  {
    path: 'dashboard',
    component: CustomerDashboardComponent,
    data: { title: 'Dashboard', breadcrumb: 'Dashboard' },
    canActivate: [AuthGuard],
  },
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule],
})
export class CustomerRouterModule {}
