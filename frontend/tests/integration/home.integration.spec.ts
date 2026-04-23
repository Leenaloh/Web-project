import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HomeComponent } from '../../src/app/pages/home/home';
import { MoviesService } from '../../src/app/services/movieService/movieService';

describe('HomeComponent Integration', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;

  beforeEach(waitForAsync(() => {
    moviesServiceSpy = jasmine.createSpyObj('MoviesService', ['autocompleteTitles']);
    moviesServiceSpy.autocompleteTitles.and.returnValue(of(['Avatar', 'Avengers']));

    TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [{ provide: MoviesService, useValue: moviesServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should navigate to movie-list on search', () => {
    const routerNavigateSpy = spyOn((component as any).router, 'navigate');

    component.form = { title: 'Test', year: '2020', director: '', starName: '' };
    component.selectedGenreString = '1';
    component.selectedTitleChar = 'T';

    component.search();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['/movie-list'], {
      queryParams: {
        title: 'Test',
        year: '2020',
        director: null,
        starName: null,
        genreId: 1,
        startsWith: 'T',
        page: 1,
        pageSize: 20,
      },
    });
  });

  it('should load autocomplete suggestions', () => {
    component.form.title = 'Av';

    component.onTitleInput();

    expect(moviesServiceSpy.autocompleteTitles).toHaveBeenCalledWith('Av');
    expect(component.titleSuggestions).toEqual(['Avatar', 'Avengers']);
    expect(component.showSuggestions).toBeTrue();
  });

  it('should select suggestion correctly', () => {
    component.titleSuggestions = ['Avatar', 'Avengers'];
    component.showSuggestions = true;

    component.selectSuggestion('Avatar');

    expect(component.form.title).toBe('Avatar');
    expect(component.showSuggestions).toBeFalse();
  });
});