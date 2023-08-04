import {TestBed} from '@angular/core/testing';
import {UserService} from './user.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {UserModel} from '../../core/models/user-model';
import {environment} from './../../environments/environment';

let service: UserService;
let httpMock: HttpTestingController;

/** mock data **/
const userMockData: UserModel = {
    'id': 'testUserId',
    'email': 'user@example.com',
};

describe('UserService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserService]
        });

        // inject the service
        service = TestBed.get(UserService);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('should get user data by Id', () => {
        service.getUser(userMockData.id)
            .subscribe((data: UserModel) => {
                expect(data).toBe(userMockData);
            });

        const req = httpMock.expectOne(
            environment.API_URL + 'user/' + userMockData.id,
            'get user by Id'
        );
        expect(req.request.method).toBe('GET');
        req.flush(userMockData);
        httpMock.verify();
    });

});
