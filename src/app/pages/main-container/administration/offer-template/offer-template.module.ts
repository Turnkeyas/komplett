import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OfferTemplateComponent } from './offer-template.component';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';

const routes: Routes = [
  { path: '', component: OfferTemplateComponent }
];

@NgModule({
  declarations: [OfferTemplateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    DirectivesModule,
    FormsModule,
    CustomFormsModule
  ]
})
export class OfferTemplateModule { }
