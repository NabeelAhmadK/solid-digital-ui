import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from 'src/app/@air/system/Guard/auth.guard'
import { LayoutsModule } from 'src/app/layouts/layouts.module'

// content components
import { ContentOverviewComponent } from './content-overview/content-overview.component'
import { ViewContentComponent } from './view-content/view-content.component'
import { ContentCrudComponent } from './content-crud/content-crud.component';
const routes: Routes = [
  {
    path: 'contents',
    component: ContentOverviewComponent,
    data: { title: 'Contents', breadcrumb: 'Contents' },
    canActivate: [AuthGuard],
  },
  {
    path: 'content',
    component: ContentCrudComponent,
    data: { title: 'Add Content', breadcrumb: 'Add Content' },
    canActivate: [AuthGuard],
  },
  {
    path: 'content/:contentId',
    component: ContentCrudComponent,
    data: { title: 'Edit Content', breadcrumb: 'Edit Content' },
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
export class ContentRouterModule { }
