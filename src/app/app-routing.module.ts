import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/custom/auth-guard-service/auth-guard.service';
import { NotAuthGuardService } from './services/custom/no-auth-guard-service/no-auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/goal', pathMatch: 'full' },
  {
    path: 'signup', loadChildren: () => import('./pages/sign-up/sign-up.module').then(m => m.SignUpModule),
    canActivate: [NotAuthGuardService]
  },
  {
    path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    canActivate: [NotAuthGuardService]
  },
  {
    path: 'create-password', loadChildren: () => import('./pages/create-password/create-password.module').then(m => m.CreatePasswordModule),
  },
  {
    path: '', loadChildren: () => import('./pages/main-container/main-container.module').then(m => m.MainContainerModule),
    canActivate: [AuthGuardService]
  },
  { path: '**', redirectTo: '/goal', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
