import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from './table.component';
import { DirectivesModule } from '../../directives/directives.module';
import { LoaderModule } from '../loader/loader.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslationModule } from '../../translation.module';
import { TableSectionsService } from './table-sections.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CustomFormsModule } from 'ng2-validation';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClientFormComponent } from '../../../pages/client-form/client-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoaderModule,
    PaginationModule,
    TranslationModule,
    DirectivesModule,
    ReactiveFormsModule,
    TooltipModule,
    CustomFormsModule,
    DragDropModule,
  ],
  declarations: [TableComponent, ClientFormComponent],
  exports: [TableComponent],
  providers: [TableSectionsService],
})
export class TablesModule {}
