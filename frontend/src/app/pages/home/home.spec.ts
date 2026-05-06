import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home';
import { MoviesService } from '../../services/movieService/movieService';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let router: Router;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;

  beforeEach(async () => {
    moviesServiceSpy = jasmine.createSpyObj('MoviesService', ['autocompleteTitles']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: MoviesService, useValue: moviesServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('search() should navigate to /movie-list with form and filters params', () => {
    const navSpy = spyOn(router, 'navigate');

    component.form = {
      title: 'Avatar',
      year: '2009',
      director: 'James Cameron',
      starName: 'Sam Worthington',
    };

    component.selectedGenreString = '1';
    component.selectedTitleChar = 'A';

    component.search();

    expect(navSpy).toHaveBeenCalledWith(['/movie-list'], {
      queryParams: {
        title: 'Avatar',
        year: '2009',
        director: 'James Cameron',
        starName: 'Sam Worthington',
        genreId: 1,
        startsWith: 'A',
        page: 1,
      },
    });
  });

  it('search() should send null for empty optional fields', () => {
    const navSpy = spyOn(router, 'navigate');

    component.search();

    expect(navSpy).toHaveBeenCalledWith(['/movie-list'], {
      queryParams: {
        title: null,
        year: null,
        director: null,
        starName: null,
        genreId: null,
        startsWith: null,
        page: 1,
      },
    });
  });

  it('clear() should reset form fields and autocomplete state', () => {
    component.form = {
      title: 'Inception',
      year: '2010',
      director: 'Christopher Nolan',
      starName: 'Leonardo DiCaprio',
    };

    component.selectedGenreString = '3';
    component.selectedTitleChar = 'I';

    component.titleSuggestions = ['Inception'];
    component.showSuggestions = true;
    component.isLoadingSuggestions = true;

    component.clear();

    expect(component.form).toEqual({
      title: '',
      year: '',
      director: '',
      starName: '',
    });

    expect(component.selectedGenreString).toBe('');
    expect(component.selectedTitleChar).toBe('');
    expect(component.titleSuggestions).toEqual([]);
    expect(component.showSuggestions).toBeFalse();
    expect(component.isLoadingSuggestions).toBeFalse();
  });

  it('onTitleInput() should not call autocompleteTitles when title length is less than 2', () => {
    component.form.title = 'A';

    component.onTitleInput();

    expect(moviesServiceSpy.autocompleteTitles).not.toHaveBeenCalled();
    expect(component.titleSuggestions).toEqual([]);
    expect(component.showSuggestions).toBeFalse();
  });

  it('onTitleInput() should call autocompleteTitles and show suggestions', () => {
    moviesServiceSpy.autocompleteTitles.and.returnValue(of(['Avatar', 'Avengers']));
    component.form.title = 'Av';

    component.onTitleInput();

    expect(moviesServiceSpy.autocompleteTitles).toHaveBeenCalledWith('Av');
    expect(component.titleSuggestions).toEqual(['Avatar', 'Avengers']);
    expect(component.showSuggestions).toBeTrue();
    expect(component.isLoadingSuggestions).toBeFalse();
  });

  it('onTitleInput() should hide suggestions on autocomplete error', () => {
    moviesServiceSpy.autocompleteTitles.and.returnValue(
      throwError(() => new Error('Autocomplete failed'))
    );

    component.form.title = 'Av';

    component.onTitleInput();

    expect(moviesServiceSpy.autocompleteTitles).toHaveBeenCalledWith('Av');
    expect(component.titleSuggestions).toEqual([]);
    expect(component.showSuggestions).toBeFalse();
    expect(component.isLoadingSuggestions).toBeFalse();
  });

  it('selectSuggestion() should set title and hide suggestions', () => {
    component.titleSuggestions = ['Avatar', 'Avengers'];
    component.showSuggestions = true;

    component.selectSuggestion('Avatar');

    expect(component.form.title).toBe('Avatar');
    expect(component.titleSuggestions).toEqual([]);
    expect(component.showSuggestions).toBeFalse();
  });

  it('hideSuggestions() should hide suggestions after timeout', fakeAsync(() => {
    component.showSuggestions = true;

    component.hideSuggestions();
    tick(150);

    expect(component.showSuggestions).toBeFalse();
  }));
});