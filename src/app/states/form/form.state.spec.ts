import {Actions, NgxsModule, ofActionDispatched, Store} from '@ngxs/store';
import {async, TestBed} from '@angular/core/testing';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Observable} from 'rxjs';
import {CookieModule} from 'ngx-cookie';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';

import {FormState} from './form.state';
import {
    LoginFormSubmitAction,
    SignUpFormSubmitAction,
} from './form.action';
import { LoginAction, SignUpAction } from '../account';
import {UniversalStorageService} from '../../services/custom/universal-storage-service/universal-storage.service';



let store: Store;
let actions$: Observable<any>;

const mockUserId = 'testUser123';
const mockToken = 'testToken1232';
const mockMovieId = '423e7d6c-ee61-11e9-81b4-2a2ae2dbcce4';

const AUTH_DESIRED_STATE =
    describe('FormState', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([FormState]),
                    CookieModule.forRoot(),
                    ReactiveFormsModule,
                    HttpClientTestingModule,
                    RouterTestingModule,
                    NgxsFormPluginModule,
                ],
                providers: [UniversalStorageService]
            }).compileComponents();
            store = TestBed.get(Store);
            store.reset({
                form: {
                    login: {
                        model: {
                            'email': 'test@email.com',
                            'password': '12345678'
                        }
                    },
                    signup: {
                        model: {
                            'email': 'test@email.com',
                            'password': '12345678'
                        }
                    },
                }
            });
            actions$ = TestBed.get(Actions);
        }));

        /**
         * Test cases for LoginFormSubmitAction
         * */
        it('should dispatch login form submit action', () => {
            actions$.pipe(ofActionDispatched(LoginAction))
                .subscribe((action) => {
                    expect(action).toBeTruthy();
                });
            store.dispatch(new LoginFormSubmitAction());
        });

        /**
         * Test cases for SignUpFormSubmitAction
         * */
        it('should dispatch signup form submit action', () => {
            actions$.pipe(ofActionDispatched(SignUpAction))
                .subscribe((action) => {
                    expect(action).toBeTruthy();
                });
            store.dispatch(new SignUpFormSubmitAction());
        });
    });

















