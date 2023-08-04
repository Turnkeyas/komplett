import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { LoaderModule } from '../../shared/components/loader/loader.module';
import { TranslationModule } from '../../shared/translation.module';
import { SubMaterialDetailsComponent } from './sub-material-details.component';
import { Widget } from '../../shared/directives/widget/widget.directive';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FileUploaderModule } from '../../shared/components/file-uploader/file-uploader.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgxsFormPluginModule,
        LoaderModule,
        TranslationModule,
        ReactiveFormsModule,
        DirectivesModule,
        FileUploaderModule,
        TooltipModule,
        BsDropdownModule
    ],
    declarations: [
        SubMaterialDetailsComponent,
    ],
    exports: [SubMaterialDetailsComponent],
    providers: [Widget]
})
export class SubMaterialDetailsModule { }
