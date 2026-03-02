import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { StarDetailsComponent } from "../../src/app/pages/star_details/star_details";

describe('StarDetailsComponent Integration', () => {
  let fixture: ComponentFixture<StarDetailsComponent>;
  let component: StarDetailsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarDetailsComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StarDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to movie details', () => {
    const routerSpy = spyOn((component as any).router, 'navigate');
    component.goMovie('tt001');
    expect(routerSpy).toHaveBeenCalledWith(['/movie_details'], { queryParams: { id: 'tt001' } });
  });
});