import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CompanySettingsComponent } from './company-settings.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  { path: '', component: CompanySettingsComponent }
];

@NgModule({
  declarations: [CompanySettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class CompanySettingsModule { }
