import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { confirmPassword, emailId, strongPassword } from 'src/app/providers/custom-validators';
import { Observable, Subject } from 'rxjs';
import { AccountFacade } from '../../states/account';
import { takeUntil } from 'rxjs/operators';
import { FormFacade } from '../../states/form';
import { AuthService } from '../../services/custom/auth-service/auth.service';
import { ToastrService } from '../../shared/services/toastr-sevice/toastr.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  getIsLoading: Observable<boolean> = this._accountFacade.isLoading$;

  public signUpForm: FormGroup;
  public isLoading: boolean;
  private ngUnsubscribe = new Subject();

  constructor(private formBuilder: FormBuilder, private _auth: AuthService,
    private _router: Router, private _toastr: ToastrService, private _accountFacade: AccountFacade,
    private _formFacade: FormFacade) {
  }

  ngOnInit(): void {
    this.fnCreateForm();
    this.fnGetIsLoading();
  }

  fnCreateForm() {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, emailId]],
      password: ['', [Validators.required, Validators.minLength(8), strongPassword]],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: confirmPassword('password', 'confirmPassword')
      }
    );
  }

  fnGetIsLoading() {
    this.getIsLoading.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        this.isLoading = val;
      });
  }

  get controls() {
    return this.signUpForm.controls;
  }

  fnSignUp() {
    if (this.signUpForm.valid) {
      this._formFacade.signUpFormSubmitAction();
    }
  }
  private fnResetSignUpFormState() {
    this._formFacade.updateFormValue({}, 'form.signup');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.fnResetSignUpFormState();
    this._accountFacade.resetAccountStateAction();
  }


}
