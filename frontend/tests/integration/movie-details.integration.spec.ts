import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { By } from "@angular/platform-browser";
import { MovieDetailsComponent } from "../../src/app/pages/movie_details/movie_details";

describe('MovieDetailsComponent Integration', () => {
  let fixture: ComponentFixture<MovieDetailsComponent>;
  let component: MovieDetailsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailsComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should increase and decrease quantity', () => {
    const initialQty = component.qty;
    component.inc();
    expect(component.qty).toBe(initialQty + 1);

    component.dec();
    component.dec();
    expect(component.qty).toBe(Math.max(1, initialQty - 1)); // never below 1
  });

  it('should navigate to star details', () => {
    const routerSpy = spyOn((component as any).router, 'navigate');
    component.goStar('nm001');
    expect(routerSpy).toHaveBeenCalledWith(['/star_details'], { queryParams: { id: 'nm001' } });
  });
});