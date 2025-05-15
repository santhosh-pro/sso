import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleItemPickerInputComponent } from './single-item-picker-input.component';

describe('SingleItemPickerInputComponent', () => {
  let component: SingleItemPickerInputComponent;
  let fixture: ComponentFixture<SingleItemPickerInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleItemPickerInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleItemPickerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
