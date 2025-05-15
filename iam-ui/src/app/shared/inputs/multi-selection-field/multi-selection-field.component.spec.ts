import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectionFieldComponent } from './multi-selection-field.component';

describe('MultiSelectionFieldComponent', () => {
  let component: MultiSelectionFieldComponent<any>;
  let fixture: ComponentFixture<MultiSelectionFieldComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectionFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiSelectionFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
