import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportComponent } from './report.component';
import { LoaderModule } from 'src/app/shared/components/loader/loader.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { TranslationModule } from 'src/app/shared/translation.module';

const routes: Routes = [
  { path: '', component: ReportComponent }
];

@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    LoaderModule,
    DirectivesModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ReportModule { }
