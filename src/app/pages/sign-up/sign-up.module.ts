import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

const routes = [
  { path: '', component: SignUpComponent }
];

@NgModule({
  declarations: [SignUpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgxsFormPluginModule,
    FormsModule,
    SharedModule
  ],
  providers: [],
})
export class SignUpModule {
}
