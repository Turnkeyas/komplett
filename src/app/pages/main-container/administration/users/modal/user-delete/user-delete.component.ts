import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import { AdminUsersFacade } from 'src/app/states';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit {
  @Input() userDetails;

  constructor(
    public bsModalRef: BsModalRef,
    private _toastr: ToastrService,
    private _adminUsersFacade: AdminUsersFacade,
  ) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  confirm() {
    this._adminUsersFacade.deleteUser(this.userDetails._id).subscribe(res => {
      this._toastr.success('Deleted Successfully', 'Success');
      this.closeModal();
    }, err => {
      this._toastr.success(err.error.message || 'Something Went Wrong', 'Error');
    })
  }

}
