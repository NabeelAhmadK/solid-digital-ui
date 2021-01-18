import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { ContentRouterModule } from './content-routing.module'
import { WidgetsComponentsModule } from 'src/app/@kit/widgets/widgets-components.module'
import { NestableModule } from 'ngx-nestable'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'
import { QuillModule } from 'ngx-quill'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ChartistModule } from 'ng-chartist'
import { NvD3Module } from 'ng2-nvd3'
import { CommonModule } from '@angular/common'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import 'd3'
import 'nvd3'

// content module components
import { ContentOverviewComponent } from 'src/app/pages/content/content-overview/content-overview.component'
import { ContentOverviewTableComponent } from 'src/app/components/content-overview-table/content-overview-table.component'

import { AddContentComponent } from 'src/app/pages/content/add-content/add-content.component'
import { AddContentFormComponent } from 'src/app/components/add-content-form/add-content-form.component'

import { EditContentFormComponent } from 'src/app/components/edit-content-form/edit-content-form.component'

import { ViewContentComponent } from 'src/app/pages/content/view-content/view-content.component'
import { ViewContentEmailComponent } from 'src/app/components/view-content-email/view-content-email.component'

const COMPONENTS = [
  AddContentComponent,
  AddContentFormComponent,
  EditContentFormComponent,
  ContentOverviewComponent,
  ContentOverviewTableComponent,
  ViewContentEmailComponent,
  ViewContentComponent,
]

@NgModule({
  imports: [
    SharedModule,
    ContentRouterModule,
    WidgetsComponentsModule,
    NestableModule,
    FormsModule,
    ChartistModule,
    NvD3Module,
    QuillModule.forRoot(),
    ReactiveFormsModule,
    PerfectScrollbarModule,
    NgbModule,
    CommonModule,
  ],
  declarations: [...COMPONENTS],
  bootstrap: [ContentOverviewTableComponent],
})
export class ContentModule {}
