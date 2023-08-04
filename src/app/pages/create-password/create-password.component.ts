import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { confirmPassword, strongPassword } from 'src/app/providers/custom-validators';
import { AuthService } from 'src/app/services/custom/auth-service/auth.service';
import { AccountFacade } from 'src/app/states';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss']
})
export class CreatePasswordComponent implements OnInit, OnDestroy {
  getIsLoading: Observable<boolean> = this._accountFacade.isLoading$;
  public createPasswordForm: FormGroup;

  public isLoading: boolean;
  private ngUnsubscribe = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private _accountFacade: AccountFacade,
    private _auth: AuthService
  ) { }

  ngOnInit(): void {
    this.fnCreateForm();
  }

  fnCreateForm() {
    this.createPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, strongPassword]],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: confirmPassword('password', 'confirmPassword')
      }
    );
  }

  get controls() {
    return this.createPasswordForm.controls;
  }

  onCreatePassword(): void {
    const formValue = this.createPasswordForm.value;
    const payload = {
      // id: this.userId,
      password: formValue.password
    };

    this._accountFacade.createPassword(payload).subscribe(
      (res: any) => {
        if (res) {
          this._auth.fnRemoveToken();
        }
      }, (err: any) => {
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
