import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { By } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { LoginComponent } from "../../src/app/pages/login/login";

describe('LoginComponent Integration', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); 
    fixture.detectChanges();
  });

  it('should navigate to home when login button is clicked', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.email = 'test@example.com';
    component.password = '123456'; 
    const loginBtn = fixture.debugElement.query(By.css('.btn-primary'));
    loginBtn.nativeElement.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });
});