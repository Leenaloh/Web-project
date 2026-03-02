import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService, LoginRequest, LoginResponse } from './authService';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should POST /api/v1/auth/login with username and password', () => {
    const mockResponse: LoginResponse = {
      status: 'SUCCESS',
      message: 'Login successful',
      userId: 1, 
      username: 'test@example.com',
    };

    const loginData: LoginRequest = {
      username: 'test@example.com',
      password: '123456',
    };

    service.login(loginData).subscribe((res) => {
      expect(res.status).toBe('SUCCESS');
      expect(res.userId).toBe(1);
      expect(res.username).toBe('test@example.com');
    });

    const req = httpMock.expectOne('/api/v1/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginData);

    req.flush(mockResponse);
  });

  it('should POST /api/v1/auth/login with alternative endpoint', () => {
    const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      useremail: 'test@example.com',
      password: '123456',
    });

    req.flush({
      status: 'SUCCESS',
      message: 'Login successful',
      userId: 'user-1',
      name: 'Test User',
    });
  });

  it('should POST /logout', () => {
    service.logout().subscribe((res) => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/logout');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should GET /me', () => {
    service.me().subscribe((res) => {
      expect(res.status).toBe('SUCCESS');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/me');
    expect(req.request.method).toBe('GET');

    req.flush({
      status: 'SUCCESS',
      message: 'User is logged in',
      userId: 'user-1',
      name: 'Test User',
    });
  });
});