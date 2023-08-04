import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from 'src/app/shared/components/loader/loader.module';
import { UserFormComponent } from './modal/user-form/user-form.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { TranslationModule } from 'src/app/shared/translation.module';
import { UserDeleteComponent } from './modal/user-delete/user-delete.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


const routes: Routes = [
  { path: '', component: UsersComponent }
];

@NgModule({
  declarations: [UsersComponent, UserFormComponent, UserDeleteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    LoaderModule,
    DirectivesModule,
    TranslationModule,
    RouterModule.forChild(routes),
    TooltipModule
  ]
})
export class UsersModule { }
