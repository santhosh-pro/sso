import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('OutlineDateInputComponent', () => {
  let component: OutlineDateInputComponentV2;
  let fixture: ComponentFixture<OutlineDateInputComponentV2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutlineDateInputComponentV2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutlineDateInputComponentV2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
