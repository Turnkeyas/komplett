import {TestBed, getTestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {AccountService} from './account.service';
import {AuthModel, AuthTokenModel} from '../../core/models/auth-model';
import {environment} from './../../environments/environment';


let service: AccountService;
let httpMock: HttpTestingController;

/** mock data **/
const mockToken = 'jwt.token.1234';
const mockSignResponse = {};
const mockTokenObj = {
    token: 'jwt.token.1234'
};

describe('AccountService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AccountService]
        });

        // inject the service
        service = TestBed.get(AccountService);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('should check login if provider is LOCAL', () => {
        const mockBodyData: AuthModel = {email: 'test@email.com', password: '12345678'};
        service.fnSignIn(mockBodyData)
            .subscribe((data: AuthTokenModel) => {
                expect(data.token).toBe(mockToken);
            });

        const req = httpMock.expectOne(
            environment.API_URL + 'account/log-in',
            'local login post to api'
        );
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockBodyData);

        req.flush({
            // tslint:disable-next-line:max-line-length
            authToken: mockToken
        });

        httpMock.verify();
    });


});
