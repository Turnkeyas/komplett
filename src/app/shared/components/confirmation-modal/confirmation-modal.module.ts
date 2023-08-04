import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ConfirmationModalComponent],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [ConfirmationModalComponent]
})
export class ConfirmationModalModule {
}
