import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserModel } from 'src/app/core/models/user-model';
import { confirmPassword, emailId, strongPassword } from 'src/app/providers/custom-validators';
import { AuthService } from 'src/app/services/custom/auth-service/auth.service';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import { AdminUsersFacade, UserFacade } from 'src/app/states';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = this._adminUsersFacade.isLoading$;
  isPasswordChange$: Observable<boolean> = this._adminUsersFacade.isPasswordChange$;
  authUser$: Observable<UserModel> = this._userFacade.authUser$;

  public userForm: FormGroup;
  public changePasswordForm: FormGroup;

  public isLoading: boolean;
  public isPasswordChange: boolean;
  private ngUnSubscribe = new Subject();

  userDetails: any;
  constructor(
    private formBuilder: FormBuilder,
    private _auth: AuthService,
    private _userFacade: UserFacade,
    private _adminUsersFacade: AdminUsersFacade,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this.fnGetIsLoading();
    this.fnGetIsPasswordChange();
    this.fnGetLoginUser();
    this.createUserForm();
    this.createChangePasswordForm();
  }

  fnGetIsLoading(): void {
    this.isLoading$.pipe(takeUntil(this.ngUnSubscribe)).subscribe(res => {
      this.isLoading = res;
    });
  }

  fnGetIsPasswordChange(): void {
    this.isPasswordChange$.pipe(takeUntil(this.ngUnSubscribe)).subscribe(res => {
      this.isPasswordChange = res;
    });
  }

  createUserForm() {
    this.userForm = this.formBuilder.group({
      email: [
        { value: this.userDetails?.email, disabled: true }
      ],
      name: [this.userDetails?.name, Validators.required],
    });
  }

  createChangePasswordForm() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      password: ['', [Validators.required, strongPassword]],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: confirmPassword('password', 'confirmPassword')
      }
    );
  }

  get controls() {
    return this.userForm.controls;
  }

  get passwordFormControls() {
    return this.changePasswordForm.controls;
  }

  fnGetLoginUser() {
    this.authUser$
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((userObj: UserModel) => {
        if (userObj) {
          this.userDetails = userObj;
        } else {
          this.userDetails = null;
        }
      });
  }

  onChangePassword() {
    const passwordFormValue = this.changePasswordForm.value;
    const payload = {
      oldPassword: passwordFormValue.oldPassword,
      password: passwordFormValue.password
    };

    this._adminUsersFacade.changePassword(payload, this.userDetails._id).subscribe(
      (res: any) => {
        if (res) {
          this._toastr.success('Password Changed Successfully', 'Successful');
          this._toastr.success('Can you please again login with new password', 'Successful');
          this._auth.fnRemoveToken();
        }
      }, (err: any) => {
        this._toastr.error(err.error.message || 'Something Went Wrong', 'Error');
      });
  }

  onUpdateUser() {
    // const userFormValue = this.userForm.value;
    const payload = { _id: this.userDetails._id, ...this.userForm.value }
    this._adminUsersFacade.updateUser(payload).subscribe(res => {
      this._toastr.success('User Updated Successfully', 'Successful');
    }, err => {
      this._toastr.error(err.error.message || 'Something Went Wrong', 'Error');
    });
  }

  ngOnDestroy() {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}
