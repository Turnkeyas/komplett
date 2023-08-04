import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialGroupsComponent } from './material-groups.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderModule } from 'src/app/shared/components/loader/loader.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ConfirmationModalModule } from '../../../../shared/components/confirmation-modal/confirmation-modal.module';

const routes: Routes = [
  { path: '', component: MaterialGroupsComponent }
];

@NgModule({
  declarations: [MaterialGroupsComponent],
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    LoaderModule,
    TranslateModule,
    DirectivesModule,
    RouterModule.forChild(routes),
    TooltipModule,
    ConfirmationModalModule
  ]
})
export class MaterialGroupsModule { }
