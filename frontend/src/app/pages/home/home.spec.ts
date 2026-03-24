import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HomeComponent } from './home';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('search() should navigate to /movie-list with form query params', () => {
    const navSpy = spyOn(router, 'navigate');

    component.form = {
      title: 'Avatar',
      year: '2009',
      director: 'James Cameron',
      starName: 'Sam Worthington',
    };

    component.search();

    expect(navSpy).toHaveBeenCalledWith(['/movie-list'], {
      queryParams: {
        title: 'Avatar',
        year: '2009',
        director: 'James Cameron',
        starName: 'Sam Worthington',
        page: 1,
        pageSize: 20,
      },
    });
  });

  it('clear() should reset the form fields', () => {
    component.form = {
      title: 'Inception',
      year: '2010',
      director: 'Christopher Nolan',
      starName: 'Leonardo DiCaprio',
    };

    component.clear();

    expect(component.form).toEqual({
      title: '',
      year: '',
      director: '',
      starName: '',
    });
  });

  it('browseGenre() should set selectedGenre and navigate with genreId query param', () => {
    const navSpy = spyOn(router, 'navigate');

    component.browseGenre(1);

    expect(component.selectedGenre).toBe(1);
    expect(navSpy).toHaveBeenCalledWith(['/movie-list'], {
      queryParams: {
        genreId: 1,
        page: 1,
        pageSize: 20,
      },
    });
  });

  it('browseTitle() should navigate with startsWith query param', () => {
    const navSpy = spyOn(router, 'navigate');

    component.browseTitle('A');

    expect(navSpy).toHaveBeenCalledWith(['/movie-list'], {
      queryParams: {
        startsWith: 'A',
        page: 1,
        pageSize: 20,
      },
    });
  });
});
