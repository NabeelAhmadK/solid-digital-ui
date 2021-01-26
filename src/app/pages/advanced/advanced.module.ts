import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from 'src/app/shared.module'
import { AdvancedRouterModule } from './advanced-routing.module'
import { WidgetsComponentsModule } from 'src/app/@kit/widgets/widgets-components.module'
import { ValidationModule } from './validation'
// layout



const COMPONENTS = [

]

@NgModule({
  imports: [
    SharedModule,
    ValidationModule,
    AdvancedRouterModule,
    FormsModule,
    ReactiveFormsModule,
    WidgetsComponentsModule,
  ],
  declarations: [...COMPONENTS],
})
export class AdvancedModule {}
