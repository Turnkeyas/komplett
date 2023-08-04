import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar.component';
import { TranslationModule } from 'src/app/shared/translation.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        NavBarComponent
    ],
    imports: [
        CommonModule,
        TranslationModule,
        RouterModule
    ],
    exports: [NavBarComponent],
    providers: [],
})
export class NavBarModule { };