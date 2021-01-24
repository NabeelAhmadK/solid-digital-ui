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
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth/login', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '404', redirectTo: '/auth/404', pathMatch: 'full' },
  {
    path: 'pages',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'client-management',
        data: { breadcrumb: 'Client Management', role: 'Admin' },
        canLoad: [AuthGuard],
        loadChildren: () => import('src/app/pages/client/client.module').then(m => m.ClientModule),
      },
      {
        path: 'content-management',
        data: { breadcrumb: 'Content Management', role: 'Admin' },
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/content/content.module').then(m => m.ContentModule),
      },
      {
        path: 'profile-page',
        data: { breadcrumb: 'Profile', role: 'All' },
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('src/app/pages/apps/apps.module').then(m => m.AppsModule),
      },
    ],
  },
  {
    path: 'pages',
    component: LayoutCustomerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'customer',
        data: { breadcrumb: 'Customer', role: 'Contact' },
        canLoad: [AuthGuard],
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
]

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: AppPreloader,
    }),
    LayoutsModule,
  ],
  providers: [AppPreloader],
  exports: [RouterModule],
})
export class AppRoutingModule { }
