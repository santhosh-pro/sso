import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgUrlIconComponent } from './svg-url-icon.component';

describe('SvgUrlIconComponent', () => {
  let component: SvgUrlIconComponent;
  let fixture: ComponentFixture<SvgUrlIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgUrlIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgUrlIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
