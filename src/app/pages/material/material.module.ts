import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../shared/components/loader/loader.module';
import { TranslationModule } from '../../shared/translation.module';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { MaterialComponent } from './material.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgxsFormPluginModule,
        LoaderModule,
        TranslationModule,
        ReactiveFormsModule,
        NgSelectModule
    ],
    declarations: [
        MaterialComponent,
    ],
    exports: [MaterialComponent],
    providers: []
})
export class MaterialDetailsModule { }
