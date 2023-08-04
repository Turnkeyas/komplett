import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Widget } from './widget/widget.directive';
import { ProgressAnimate } from './progress-animate/progress-animate.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        Widget,
        ProgressAnimate,
    ],
    exports: [
        Widget,
        ProgressAnimate
    ]
})
export class DirectivesModule { }
