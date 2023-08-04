import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { TablesModule } from '../../../shared/components/table/table.module';
import { TableDataService } from '../../../services/table-data/table-data.service';

const routes = [
    { path: '', component: DashboardComponent },
    {
        path: ':division/:type', component: DashboardComponent
    }
];

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TablesModule
    ],
    exports: [DashboardComponent],
    providers: [TableDataService],
})
export class DashboardModule { }
