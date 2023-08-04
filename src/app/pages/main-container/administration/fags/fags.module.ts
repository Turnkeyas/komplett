import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FagsComponent } from './fags.component';
import { LoaderModule } from 'src/app/shared/components/loader/loader.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { FagFormComponent } from './modal/fag-form/fag-form.component';
import { FagDeleteComponent } from './modal/fag-delete/fag-delete.component';
import { TranslationModule } from 'src/app/shared/translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  { path: '', component: FagsComponent }
];

@NgModule({
  declarations: [FagsComponent, FagFormComponent, FagDeleteComponent],
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
export class FagsModule { }
