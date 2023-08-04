import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu.component';
import { RouterModule } from '@angular/router';
import { SideMenuService } from 'src/app/services/side-menu/menu.service';
import { TranslationModule } from 'src/app/shared/translation.module';

@NgModule({
    declarations: [
        SideMenuComponent
    ],
    imports: [
        CommonModule,
        TranslationModule,
        RouterModule
    ],
    exports: [SideMenuComponent],
    providers: [SideMenuService],
})
export class SideMenuModule { }
