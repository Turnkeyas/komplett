import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import { AdminUsersFacade, FagsFacade } from 'src/app/states';

@Component({
  selector: 'app-fag-delete',
  templateUrl: './fag-delete.component.html',
  styleUrls: ['./fag-delete.component.scss']
})
export class FagDeleteComponent implements OnInit {
  @Input() fagDetails: any;
  @Input() fagList: any;
  @Input() isFagUsed: boolean;

  selectedfag: any;

  constructor(
    public bsModalRef: BsModalRef,
    private _toastr: ToastrService,
    private _fagFacade: FagsFacade,
  ) { }

  ngOnInit(): void {
    this.fagList = this.fagList.filter((fag: any) => fag._id !== this.fagDetails._id);

    if (this.fagList && this.fagList.length) {
      this.selectedfag = this.fagList[0];
    }
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  confirm() {
    if (this.isFagUsed) {
      const payload = {
        oldFagId: this.fagDetails._id,
        newFagId: this.selectedfag._id
      }

      this._fagFacade.replaceFag(payload).subscribe(res => {
        this._toastr.success('Replaced and Deleted Successfully', 'Success')
        this.closeModal();
      }, err => {
        this._toastr.success(err.error.message || 'Something Went Wrong', 'Error');
      })
    } else {
      this._fagFacade.deleteFag(this.fagDetails._id).subscribe(res => {
        this._toastr.success('Deleted Successfully', 'Success');
        this.closeModal();
      }, err => {
        this._toastr.success(err.error.message || 'Something Went Wrong', 'Error');
      })
    }
  }

}
