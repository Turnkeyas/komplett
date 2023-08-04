import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { USERROLES } from 'src/app/core/constants/constants';
import { emailId } from 'src/app/providers/custom-validators';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import { AdminUsersFacade } from 'src/app/states';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = this._adminUsersFacade.isLoading$;

  @Input() userDetails;
  @Input() selectedRole = USERROLES.USER;
  @Input() isEditMode;

  isLoading: boolean = false;
  USERROLES = USERROLES;
  rolesDropDownKeys;
  randomPassword: string = '';
  public userForm: FormGroup;
  private ngUnSubscribe: Subject<any> = new Subject();

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private _adminUsersFacade: AdminUsersFacade,
    private _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.fnGetIsLoading();
    this.createForm();
    this.createRolesDropDownKeys();
    if (!this.isEditMode) {
      this.randomPassword = this.password_generator(15);
    }
  }

  fnGetIsLoading(): void {
    this.isLoading$.pipe(takeUntil(this.ngUnSubscribe)).subscribe((res) => {
      this.isLoading = res;
    });
  }

  createRolesDropDownKeys() {
    this.rolesDropDownKeys = Object.keys(USERROLES);
    this.rolesDropDownKeys.shift();
    this.selectedRole = this.isEditMode ? this.userDetails?.role : 'USER';
    this.rolesDropDownKeys = this.rolesDropDownKeys.map((e, index) => {
      return {
        name: e,
        isSelected: e === this.selectedRole ? true : false,
      };
    });
  }

  onSelectionChange(e) {
    this.selectedRole = e.name;
    this.rolesDropDownKeys.forEach((list) => {
      if (list.name === e.name) {
        list.isSelected = true;
      } else {
        list.isSelected = false;
      }
    });
  }

  createForm() {
    this.userForm = this.formBuilder.group({
      email: [
        { value: this.userDetails?.email, disabled: this.isEditMode },
        [Validators.required, emailId],
      ],
      name: [this.userDetails?.name, Validators.required],
    });
  }

  get controls() {
    return this.userForm.controls;
  }

  confirmClick() {
    const data = {
      ...this.userForm.value,
      role: this.selectedRole,
    };

    if (!this.isEditMode) {
      data['password'] = this.randomPassword;
    }
    if (this.isEditMode) {
      data['_id'] = this.userDetails?._id;
      this._adminUsersFacade.updateUser(data).subscribe(
        (res) => {
          this._toastr.success('User Updated Successfully', 'Successful');
          this.bsModalRef.hide();
        },
        (err) => {
          this._toastr.error(
            err.error.message || 'Something Went Wrong',
            'Error'
          );
        }
      );
    } else {
      this._adminUsersFacade.insertUser(data).subscribe(
        (res) => {
          this._toastr.success('User Inserted Successfully', 'Successful');
          this.bsModalRef.hide();
        },
        (err) => {
          this._toastr.error(
            err.error.message || 'Something Went Wrong',
            'Error'
          );
        }
      );
    }
  }

  password_generator(len) {
    var length = len ? len : 10;
    var string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; //to upper
    var numeric = '0123456789';
    var punctuation = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    var password = '';
    var character = '';
    var crunch = true;
    while (password.length < length) {
      let entity1 = Math.ceil(string.length * Math.random() * Math.random());
      let entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
      let entity3 = Math.ceil(
        punctuation.length * Math.random() * Math.random()
      );
      let hold = string.charAt(entity1);
      hold = password.length % 2 == 0 ? hold.toUpperCase() : hold;
      character += hold;
      character += numeric.charAt(entity2);
      character += punctuation.charAt(entity3);
      password = character;
    }
    password = password
      .split('')
      .sort(function () {
        return 0.5 - Math.random();
      })
      .join('');
    return password.substr(0, len);
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  ngOnDestroy() {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}
