import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from 'src/app/@air/system/Guard/auth.guard'
// Apps
import { AppsProfileComponent } from './profile/profile.component'

const routes: Routes = [
  {
    path: 'edit-profile',
    component: AppsProfileComponent,
    data: { title: 'Edit Profile', breadcrumb: 'Edit Profile' },
    canActivate: [AuthGuard],
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule],
})
export class AppsRouterModule { }
