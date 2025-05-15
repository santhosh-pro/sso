import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSvgIconComponent } from './app-svg-icon.component';

describe('AppSvgIconComponent', () => {
  let component: AppSvgIconComponent;
  let fixture: ComponentFixture<AppSvgIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSvgIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppSvgIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
