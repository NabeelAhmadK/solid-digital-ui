import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { CustomerRouterModule } from './customer-routing.module'
import { WidgetsComponentsModule } from 'src/app/@kit/widgets/widgets-components.module'
import { NestableModule } from 'ngx-nestable'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ChartistModule } from 'ng-chartist'
import { NvD3Module } from 'ng2-nvd3'

import 'd3'
import 'nvd3'

// customer module components
import { CustomerDashboardComponent } from 'src/app/pages/customer/customer-dashboard/customer-dashboard.component'

const COMPONENTS = [CustomerDashboardComponent]

@NgModule({
  imports: [
    SharedModule,
    CustomerRouterModule,
    WidgetsComponentsModule,
    NestableModule,
    FormsModule,
    ChartistModule,
    NvD3Module,
    ReactiveFormsModule,
  ],
  declarations: [...COMPONENTS],
})
export class CustomerModule {}
