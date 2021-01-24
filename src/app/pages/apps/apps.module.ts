import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared.module'
import { AppsRouterModule } from './apps-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'
import { QuillModule } from 'ngx-quill'
import { SortablejsModule } from 'ngx-sortablejs'
import { NestableModule } from 'ngx-nestable'
import { WidgetsComponentsModule } from 'src/app/@kit/widgets/widgets-components.module'
// Apps
import { AppsProfileComponent } from './profile/profile.component'
const COMPONENTS = [
  AppsProfileComponent
]

@NgModule({
  imports: [
    SharedModule,
    AppsRouterModule,
    ReactiveFormsModule,
    FormsModule,
    PerfectScrollbarModule,
    WidgetsComponentsModule,
    QuillModule.forRoot(),
    SortablejsModule,
    NestableModule,
  ],
  declarations: [...COMPONENTS],
})
export class AppsModule { }
