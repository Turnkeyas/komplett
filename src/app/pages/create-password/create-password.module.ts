import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreatePasswordComponent } from './create-password.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes = [
  { path: '', component: CreatePasswordComponent }
];

@NgModule({
  declarations: [CreatePasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  providers: [],
})
export class CreatePasswordModule {
}
