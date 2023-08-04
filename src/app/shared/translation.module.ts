import { NgModule } from '@angular/core';
import { ToastrService } from './services/toastr-sevice/toastr.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CommonModule } from '@angular/common';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../assets/i18n/', '.json');
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      defaultLanguage: 'English',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: false
    }),
  ],
  exports: [
    TranslateModule,
  ],
  providers: [ToastrService],
})
export class TranslationModule {
  static forRoot() {
    return {
      ngModule: TranslationModule,
      providers: []
    };
  }
}
