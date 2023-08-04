import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { SharedModule } from 'src/app/shared/shared.module';

export const routes = [
  { path: '', component: CalendarComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    CalendarComponent
  ],
  providers: []
})
export class CalendarModule { }
