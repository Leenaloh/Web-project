import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { StarDetailsComponent } from './star_details';
import { AuthService } from '../../services/authService/authService';
import { StarsService } from '../../services/starsService/starsService';

describe('StarDetailsComponent', () => {
  let fixture: ComponentFixture<StarDetailsComponent>;
  let component: StarDetailsComponent;
  let starsServiceSpy: jasmine.SpyObj<StarsService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    starsServiceSpy = jasmine.createSpyObj('StarsService', ['getStarById']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    authServiceSpy.logout.and.returnValue(of(void 0));

    starsServiceSpy.getStarById.and.returnValue(
      of({ id: 'nm001', name: 'X', movies: [] } as any)
    );

    const activatedRouteStub = {
      snapshot: {
        queryParamMap: convertToParamMap({ id: 'nm001' }),
      },
    };

    await TestBed.configureTestingModule({
      imports: [StarDetailsComponent],
      providers: [
        provideRouter([]),
        { provide: StarsService, useValue: starsServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StarDetailsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('goMovie() should navigate to /movie_details with id query param', () => {
    const navSpy = spyOn(router, 'navigate');

    component.goMovie('tt001');

    expect(navSpy).toHaveBeenCalledWith(['/movie_details'], {
      queryParams: { id: 'tt001' },
    });
  });

  it('should load star by id from route on init', () => {
    component.ngOnInit();

    expect(starsServiceSpy.getStarById).toHaveBeenCalledWith('nm001');
  });
});
