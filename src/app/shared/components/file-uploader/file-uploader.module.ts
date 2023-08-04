import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from './file-uploader.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        TooltipModule,
        TranslateModule
    ],
    declarations: [
        FileUploaderComponent
    ],
    exports: [FileUploaderComponent]
})
export class FileUploaderModule { }
