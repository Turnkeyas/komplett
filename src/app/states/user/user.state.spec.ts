import {async, TestBed} from '@angular/core/testing';
import {NgxsModule, Store} from '@ngxs/store';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CookieModule} from 'ngx-cookie';
import {of} from 'rxjs';

import {UserState} from './user.state';
import {
    GetAuthUserAction,
} from './user.action';
import {UserService} from './user.service';
import {AuthService} from '../../services/custom/auth-service/auth.service';
import {UserModel} from '../../core/models/user-model';
import {UniversalStorageService} from '../../services/custom/universal-storage-service/universal-storage.service';
import {ToastrService} from '../../services/toastr-sevice/toastr.service';

/** mock data **/
let store: Store;
let userService: UserService;
let toastr: ToastrService;
let auth: AuthService;
const userMockData: UserModel = {
    'id': 'testUserId',
    'email': 'user@example.com',

};
const mockUser = {
    'id': 'User Id',
    'email': 'user@example.com',
};
const mockUserId = 'testUserId';


describe('UserState', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([UserState]),
                CookieModule.forRoot(),
                ReactiveFormsModule,
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [UniversalStorageService]
        }).compileComponents();
        store = TestBed.get(Store);
        userService = TestBed.get(UserService);
        toastr = TestBed.get(ToastrService);
        auth = TestBed.get(AuthService);
    }));

    /**
     * Test cases for GetAuthUserAction
     * */
    it('should dispatch an auth user action', async(() => {
        spyOn(userService, 'getUser').and.returnValue(of(userMockData)); // <- Observable
        store.dispatch(new GetAuthUserAction(mockUserId));
        store.selectOnce(state => state.user.authUser).subscribe(authUser => {
            expect(authUser).toEqual(userMockData);
        });
    }));

});

