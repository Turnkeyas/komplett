import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainContainerComponent } from './main-container.component';
import { RouterModule } from '@angular/router';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SideMenuModule } from '../side-menu/side-menu.module';
import { MaterialDetailsModule } from '../material/material.module';
import { AdminAuthGuard } from '../../services/custom/auth-guard-service/admin-auth-guard.service';

const routes = [
  {
    path: '',
    component: MainContainerComponent,
    children: [
      {
        path: 'goal',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        data: { breadcrumb: 'Goal' },
      },
      {
        path: 'mail',
        loadChildren: () =>
          import('../mail/mail.module').then((m) => m.MailModule),
        data: { breadcrumb: 'Mail' },
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('../calendar/calendar.module').then((m) => m.CalendarModule),
        data: { breadcrumb: 'Calendar' },
      },
      {
        path: 'master-material',
        loadChildren: () =>
          import('../master-material/master-material.module').then(
            (m) => m.MasterMaterialModule
          ),
        data: { breadcrumb: 'Master Material' },
      },
      {
        path: 'administration',
        canActivate: [AdminAuthGuard],
        loadChildren: () =>
          import('./administration/administration.module').then(
            (m) => m.AdministrationModule
          ),
        data: { breadcrumb: 'Administration' },
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
        data: { breadcrumb: 'profile' },
      },
      {
        path: 'offer-template',
        loadChildren: () =>
          import('./report/report.module').then((m) => m.ReportModule),
        data: { breadcrumb: 'Offer Template' },
      },
    ],
  },
];

@NgModule({
  declarations: [MainContainerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SideMenuModule,
    NavBarModule,
    SharedModule,
    MaterialDetailsModule,
  ],
  exports: [MainContainerComponent],
})
export class MainContainerModule {}
