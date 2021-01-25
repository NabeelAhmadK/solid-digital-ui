import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule, LOCALE_ID } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { NgProgressModule } from '@ngx-progressbar/core'
import { NgProgressRouterModule } from '@ngx-progressbar/router'
import { NgProgressHttpModule } from '@ngx-progressbar/http'

import { NzSpinModule } from 'ng-zorro-antd/spin'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreRouterConnectingModule } from '@ngrx/router-store'
import { reducers, metaReducers } from './store/reducers'
import { UserEffects } from './store/user/effects'
import { jwtAuthService } from './services/jwt'
import { ClientService } from './services/client'
import { ContactPersonService } from './services/contact-person'
import { ContentService } from './services/content'

// locale resistration
import { registerLocaleData } from '@angular/common'
import { default as localeEn } from '@angular/common/locales/en'
import { NZ_I18N, en_US as localeZorro } from 'ng-zorro-antd'
const LOCALE_PROVIDERS = [
  { provide: LOCALE_ID, useValue: 'en' },
  { provide: NZ_I18N, useValue: localeZorro },
]
registerLocaleData(localeEn, 'en')

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    NzSpinModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,

    // translate
    TranslateModule.forRoot(),

    // ngrx
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([UserEffects]),
    StoreRouterConnectingModule.forRoot(),

    // nprogress
    NgProgressModule.withConfig({
      thick: true,
      spinner: false,
      color: '#0190fe',
    }),
    NgProgressRouterModule,
    NgProgressHttpModule,
  ],
  providers: [
    // services
    jwtAuthService,
    ClientService,
    ContentService,
    ContactPersonService,

    // locale providers
    ...LOCALE_PROVIDERS,

    // firestore settings
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
