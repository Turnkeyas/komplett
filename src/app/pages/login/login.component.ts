import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailId, strongPassword } from '../../providers/custom-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountFacade, LoginAction } from '../../states/account';
import { FormFacade } from '../../states/form';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  getIsLoading: Observable<boolean> = this._accountFacade.isLoading$;
  public loginForm: FormGroup;
  public isLoading: boolean;
  private ngUnsubscribe = new Subject();


  constructor(private formBuilder: FormBuilder, private _formFacade: FormFacade, private _accountFacade: AccountFacade) {
  }

  ngOnInit(): void {
    this.fnCreateForm();
    this.fnGetIsLoading();
  }

  private fnCreateForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, emailId]],
      password: ['', [Validators.required, Validators.minLength(8), strongPassword]]
    });
  }

  fnGetIsLoading() {
    this.getIsLoading.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        this.isLoading = val;
      });
  }

  get controls() {
    return this.loginForm.controls;
  }

  fnSignIn() {
    if (this.loginForm.valid) {
      this._formFacade.loginFormSubmitAction();
    }
  }
  private fnResetLoginFormState() {
    this._formFacade.updateFormValue({}, 'form.login');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.fnResetLoginFormState();
    this._accountFacade.resetAccountStateAction();
  }

}
