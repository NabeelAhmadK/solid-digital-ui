import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from 'src/app/shared.module'
import { LayoutsModule } from 'src/app/layouts/layouts.module'
import { AppPreloader } from 'src/app/app-routing-loader'
import { AuthGuard } from 'src/app/@air/system/Guard/auth.guard'

// layouts & notfound
import { LayoutAuthComponent } from 'src/app/layouts/Auth/auth.component'
import { LayoutMainComponent } from 'src/app/layouts/Main/main.component'
import { LayoutCustomerComponent } from 'src/app/layouts/Customer/customer.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'client/client_overview',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutMainComponent,
    children: [
      {
        path: 'client',
        data: { breadcrumb: 'Client' },
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/pages/client/client.module').then(m => m.ClientModule),
      },
      {
        path: 'content',
        data: { breadcrumb: 'Content' },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/content/content.module').then(m => m.ContentModule),
      },
    ],
  },
  {
    path: '',
    component: LayoutCustomerComponent,
    children: [
      {
        path: 'customer',
        data: { breadcrumb: 'Customer' },
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/customer/customer.module').then(m => m.CustomerModule),
      },
    ],
  },
  {
    path: 'auth',
    component: LayoutAuthComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/auth/auth.module').then(m => m.AuthModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/auth/404',
  },
]

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: AppPreloader,
    }),
    LayoutsModule,
  ],
  providers: [AppPreloader],
  exports: [RouterModule],
})
export class AppRoutingModule {}
