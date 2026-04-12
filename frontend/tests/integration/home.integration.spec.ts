import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { By } from "@angular/platform-browser";
import { HomeComponent } from "../../src/app/pages/home/home";

describe('HomeComponent Integration', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should navigate to movie-list on search', () => {
    const routerNavigateSpy = spyOn((component as any).router, 'navigate');

    component.form = { title: 'Test', year: '2020', director: '', starName: '' };
    component.search();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['/movie-list'], { queryParams: component.form });
  });

  it('should navigate with genre filter', () => {
    const routerNavigateSpy = spyOn((component as any).router, 'navigate');

    component.browseGenre(1);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/movie-list'], { queryParams: { genre: 'Action' } });
  });

  it('should navigate with starting letter', () => {
    const routerNavigateSpy = spyOn((component as any).router, 'navigate');

    component.browseTitle('A');
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/movie-list'], { queryParams: { startsWith: 'A' } });
  });
});