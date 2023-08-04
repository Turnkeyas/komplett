import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() confirmBtnName: string;
  _isLoading: boolean;

  private onConfirm = new BehaviorSubject(false);

  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  @Input() set isLoading(val: boolean) {
    this._isLoading = val;

    if (!val) {
      this.modalService.hide();
    }
  }

  confirm(): void {
    this.onConfirm.next(true);
  }

  decline(): void {
    this.modalService.hide();
  }
}
