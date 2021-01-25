import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from 'src/app/@air/system/Guard/auth.guard'
import { LayoutsModule } from 'src/app/layouts/layouts.module'

// dashboard
import { ClientOverviewComponent } from 'src/app/pages/client/client-overview/client-overview.component'
import { AddClientComponent } from 'src/app/pages/client/add-client/add-client.component'
import { AddContactPersonComponent } from 'src/app/pages/client/add-contact-person/add-contact-person.component'

const routes: Routes = [
  {
    path: 'client',
    component: AddClientComponent,
    data: { title: 'Add Client', breadcrumb: 'Add client' },
    canActivate: [AuthGuard],
  },
  {
    path: 'client/:clientId',
    component: AddClientComponent,
    data: { title: 'Edit Client', breadcrumb: 'Edit client' },
    canActivate: [AuthGuard],
  },
  {
    path: 'contact-person',
    component: AddContactPersonComponent,
    data: { title: 'Add Contact Person', breadcrumb: 'Add contact person' },
    canActivate: [AuthGuard],
  },
  {
    path: 'contact-person/:contactPersonId',
    component: AddContactPersonComponent,
    data: { title: 'Edit Contact Person', breadcrumb: 'Edit contact person' },
    canActivate: [AuthGuard],
  },
  {
    path: 'clients',
    component: ClientOverviewComponent,
    data: { title: 'Clients', breadcrumb: 'Client Overview' },
    canActivate: [AuthGuard],
  },
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule],
})
export class ClientRouterModule { }
