import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/custom/auth-service/auth.service';
import { LoaderModule } from '../../shared/components/loader/loader.module';
import { TranslationModule } from '../../shared/translation.module';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

const routes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgxsFormPluginModule,
    FormsModule,
    LoaderModule,
    TranslationModule
  ],
  providers: [AuthService],
})
export class LoginModule {
}
