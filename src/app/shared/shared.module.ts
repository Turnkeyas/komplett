import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from './components/breadcrumb/breadcrumb.module';
import { LoaderModule } from './components/loader/loader.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TablesModule } from './components/table/table.module';
import { DirectivesModule } from './directives/directives.module';
import { PipesModule } from './pipes/pipes.module';
import { ToastrService } from './services/toastr-sevice/toastr.service';
import { TranslationModule } from './translation.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        BreadcrumbModule,
        LoaderModule,
        PaginationModule,
        TablesModule,
        DirectivesModule,
        PipesModule,
        TranslationModule.forRoot()
    ],
    exports: [
        TranslationModule,
        BreadcrumbModule,
        LoaderModule,
        PaginationModule,
        TablesModule,
        DirectivesModule,
        PipesModule,
    ],
    providers: [ToastrService],
})
export class SharedModule { }
