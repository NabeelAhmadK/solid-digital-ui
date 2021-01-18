import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { LayoutModule } from 'src/app/@air/layout/layout.module'

import { LayoutAuthComponent } from './Auth/auth.component'
import { LayoutMainComponent } from './Main/main.component'
import { LayoutPublicComponent } from './Public/public.component'
import { LayoutCustomerComponent } from './Customer/customer.component'

const COMPONENTS = [
  LayoutAuthComponent,
  LayoutMainComponent,
  LayoutPublicComponent,
  LayoutCustomerComponent,
]

@NgModule({
  imports: [SharedModule, LayoutModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class LayoutsModule {}
