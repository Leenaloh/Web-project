import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './authService';

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

  it('should POST /api/v1/auth/login with useremail and password', () => {
    service.login({ useremail: 'test@example.com', password: '123456' }).subscribe((res) => {
      expect(res.status).toBe('SUCCESS');
      expect(res.userId).toBe('user-1');
    });

    const req = httpMock.expectOne('/api/v1/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
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

    const req = httpMock.expectOne('/api/v1/auth/logout');
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(null);
  });

  it('should GET /me', () => {
    service.me().subscribe((res) => {
      expect(res.status).toBe('SUCCESS');
      expect(res.userId).toBe('user-1');
    });

    const req = httpMock.expectOne('/api/v1/auth/me');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();

    req.flush({
      status: 'SUCCESS',
      message: 'User is logged in',
      userId: 'user-1',
      name: 'Test User',
    });
  });
});