import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { ClientRouterModule } from './client-routing.module'
import { WidgetsComponentsModule } from 'src/app/@kit/widgets/widgets-components.module'
import { NestableModule } from 'ngx-nestable'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { ChartistModule } from 'ng-chartist'
import { NvD3Module } from 'ng2-nvd3'
import { CommonModule } from '@angular/common'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import 'd3'
import 'nvd3'

// client module components
import { NgbdSortableHeader } from 'src/app/services/client/sortable.directive'

import { ClientOverviewComponent } from 'src/app/pages/client/client-overview/client-overview.component'
import { ClientOverviewTableComponent } from 'src/app/components/client-overview-table/client-overview-table.component'

import { AddClientComponent } from 'src/app/pages/client/add-client/add-client.component'
import { AddClientFormComponent } from 'src/app/components/add-client-form/add-client-form.component'
import { EditClientFormComponent } from 'src/app/components/edit-client-form/edit-client-form.component'

import { ContactPersonTableComponent } from 'src/app/components/contact-person-table/contact-person-table.component'

import { AddContactPersonComponent } from 'src/app/pages/client/add-contact-person/add-contact-person.component'
import { AddContactPersonFormComponent } from 'src/app/components/add-contact-person-form/add-contact-person-form.component'
import { EditContactPersonFormComponent } from 'src/app/components/edit-contact-person-form/edit-contact-person-form.component'

const COMPONENTS = [
  ClientOverviewComponent,
  ClientOverviewTableComponent,
  AddClientComponent,
  AddClientFormComponent,
  EditClientFormComponent,
  ContactPersonTableComponent,
  AddContactPersonComponent,
  AddContactPersonFormComponent,
  EditContactPersonFormComponent,
  NgbdSortableHeader,
]

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ClientRouterModule,
    WidgetsComponentsModule,
    NestableModule,
    FormsModule,
    ChartistModule,
    NvD3Module,
    ReactiveFormsModule,
    NzSelectModule,
    NgbModule,
  ],
  declarations: [...COMPONENTS],
  bootstrap: [ClientOverviewTableComponent],
})
export class ClientModule {}
