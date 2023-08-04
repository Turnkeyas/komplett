import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb.component';
import { RouterModule } from '@angular/router';
import { TranslationModule } from '../../translation.module';

@NgModule({
    declarations: [
        BreadcrumbComponent
    ],
    imports: [
        CommonModule,
        TranslationModule,
        RouterModule
    ],
    exports: [BreadcrumbComponent],
    providers: [],
})
export class BreadcrumbModule { }
