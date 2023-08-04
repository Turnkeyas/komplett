import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../shared/components/loader/loader.module';
import { TranslationModule } from '../../shared/translation.module';
import { MasterMaterialComponent } from './master-material.component';
import { RouterModule } from '@angular/router';
import { SubMaterialDetailsModule } from '../sub-material-details/sub-material.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TranslatePipe } from '@ngx-translate/core';

const routes = [
    { path: '', component: MasterMaterialComponent },
    {
        path: ':type', component: MasterMaterialComponent
    }
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LoaderModule,
        TranslationModule,
        ReactiveFormsModule,
        SubMaterialDetailsModule,
        RouterModule.forChild(routes),
        DirectivesModule,
        NgxDatatableModule,
        PaginationModule,
        LoaderModule,
        TooltipModule,
        BsDropdownModule
    ],
    declarations: [
        MasterMaterialComponent,
    ],
    exports: [MasterMaterialComponent],
    providers: [TranslatePipe]
})
export class MasterMaterialModule { }
