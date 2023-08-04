import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './administration.component';


const routes: Routes = [
  { path: '', component: AdministrationComponent },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule), data: { breadcrumb: 'users' } },
  { path: 'fags', loadChildren: () => import('./fags/fags.module').then(m => m.FagsModule), data: { breadcrumb: 'fags' } },
  {
    path: 'company-settings',
    loadChildren: () => import('./company-settings/company-settings.module').then(m => m.CompanySettingsModule),
    data: { breadcrumb: 'Company Settings' }
  },
  {
    path: 'surcharge',
    loadChildren: () => import('./offer-template/offer-template.module').then(m => m.OfferTemplateModule),
    data: { breadcrumb: 'Surcharge' }
  },
  {
    path: 'material-groups',
    loadChildren: () => import('./material-groups/material-groups.module').then(m => m.MaterialGroupsModule),
    data: { breadcrumb: 'Material Groups' }
  },
];

@NgModule({
  declarations: [AdministrationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdministrationModule { }
