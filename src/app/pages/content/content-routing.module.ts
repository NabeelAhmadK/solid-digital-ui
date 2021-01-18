import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from 'src/app/@air/system/Guard/auth.guard'
import { LayoutsModule } from 'src/app/layouts/layouts.module'

// content components
import { ContentOverviewComponent } from 'src/app/pages/content/content-overview/content-overview.component'
import { AddContentComponent } from 'src/app/pages/content/add-content/add-content.component'
import { EditContentFormComponent } from 'src/app/components/edit-content-form/edit-content-form.component'
import { ViewContentComponent } from 'src/app/pages/content/view-content/view-content.component'

const routes: Routes = [
  {
    path: 'content_overview',
    component: ContentOverviewComponent,
    data: { title: 'Content Overview', breadcrumb: 'Content overview' },
    canActivate: [AuthGuard],
  },
  {
    path: 'add_content',
    component: AddContentComponent,
    data: { title: 'Add Content', breadcrumb: 'Add content' },
    canActivate: [AuthGuard],
  },
  {
    path: 'edit_content/:id',
    component: EditContentFormComponent,
    data: { title: 'Edit Content', breadcrumb: 'Edit content' },
    canActivate: [AuthGuard],
  },
  {
    path: 'view_content',
    component: ViewContentComponent,
    data: { title: 'View Content', breadcrumb: 'View content' },
    canActivate: [AuthGuard],
  },
]

@NgModule({
  imports: [LayoutsModule, RouterModule.forChild(routes)],
  providers: [],
  exports: [RouterModule],
})
export class ContentRouterModule {}
