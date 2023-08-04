import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UniversalStorageService } from '../app/services/custom/universal-storage-service/universal-storage.service';
import { AuthGuardService } from '../app/services/custom/auth-guard-service/auth-guard.service';
import { NotAuthGuardService } from '../app/services/custom/no-auth-guard-service/no-auth-guard.service';
import { InterceptorService } from '../app/services/custom/interceptor-service/interceptor.service';
import { StartupService } from '../app/services/custom/startup-service/startup.service';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AppState } from './app.state';
import { AppConfig } from './app.config';
import { StateModule } from './states/state.module';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { TranslationModule } from '../app/shared/translation.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SubMaterialDetailsModule } from './pages/sub-material-details/sub-material.module';
import { NgSelectModule } from '@ng-select/ng-select';

export function init(startup: StartupService): Function {
  return (): Promise<any> => startup.init();
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    AppRoutingModule,
    /* State Management */
    StateModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    SubMaterialDetailsModule,
    NgSelectModule,
    ModalModule.forRoot(),
    TranslateModule.forRoot({
      // defaultLanguage: 'nb_No',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: false,
    }),
    TranslationModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      multi: true,
      deps: [StartupService],
    },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    UniversalStorageService,
    AuthGuardService,
    NotAuthGuardService,
    AppState,
    AppConfig,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
