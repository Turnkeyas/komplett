import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Actions, NgxsModule, ofActionDispatched, Store} from '@ngxs/store';
import {async, TestBed} from '@angular/core/testing';
import {Observable, of, throwError} from 'rxjs';
import {Router} from '@angular/router';

import {
  LoginAction,
} from './account.action';
import {AccountState} from './account.state';
import {AccountService} from './account.service';
import {AuthService} from '../../services/custom/auth-service/auth.service';
import {ToastrService} from '../../services/toastr-sevice/toastr.service';
import {UniversalStorageService} from '../../services/custom/universal-storage-service/universal-storage.service';
import {CookieService} from 'ngx-cookie-service';


/* service variable declaration */
let store: Store;
let accountService: AccountService;
let authService: AuthService;
let toaster: ToastrService;
let actions$: Observable<any>;
const routerMock = {navigate: jasmine.createSpy('navigate')};

const mockLoginData = {
    email: 'test@example.com',
    password: '12345678'
};

const mockAccountData = {
    'token': 'token12323'
};

describe('AccountState', () => {

    beforeEach(async(() => {
        /* injecting the service */
        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([AccountState]),
            ],
            providers: [CookieService, UniversalStorageService, {provide: Router, useValue: routerMock}]
        }).compileComponents();
        store = TestBed.get(Store);
        accountService = TestBed.get(AccountService);
        authService = TestBed.get(AuthService);
        toaster = TestBed.get(ToastrService);
        actions$ = TestBed.get(Actions);
    }));

    /**
     * Test cases for LocalLoginAction
     * */
    it('should dispatch a local login action', async(() => {
        spyOn(accountService, 'fnSignIn').and.returnValue(of(mockAccountData)); // <- Observable
        spyOn(authService, 'fnGetAuthUser');
        spyOn(authService, 'fnSetToken');
        spyOn(toaster, 'success');
        store.dispatch(new LoginAction(mockLoginData));
        store.selectOnce(state => state.account.auth).subscribe(auth => {
            expect(authService.fnGetAuthUser).toHaveBeenCalled();
            expect(authService.fnSetToken).toHaveBeenCalled();
            expect(toaster.success).toHaveBeenCalled();
            expect(auth).toBe(mockAccountData);
            expect(routerMock.navigate).toHaveBeenCalledWith(['/offer-template']);
        });
    }));

});
