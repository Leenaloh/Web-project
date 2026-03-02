import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { By } from "@angular/platform-browser";
import { MovieListComponent } from "../../src/app/pages/movie_list/movie_list";

describe('MovieListComponent Integration', () => {
  let fixture: ComponentFixture<MovieListComponent>;
  let component: MovieListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieListComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to movie details on title click', () => {
    const routerSpy = spyOn((component as any).router, 'navigate');

    component.goDetails('tt001');
    expect(routerSpy).toHaveBeenCalledWith(['/movie_details'], { queryParams: { id: 'tt001' } });
  });
});