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

// content components
import { ContentOverviewComponent } from './content-overview/content-overview.component'
import { ContentCrudComponent } from './content-crud/content-crud.component';

const COMPONENTS = [
  ContentOverviewComponent,
  ContentCrudComponent
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
  bootstrap: [],
})
export class ContentModule { }
