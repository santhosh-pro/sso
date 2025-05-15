import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkImageComponent } from './network-image.component';

describe('NetworkImageComponent', () => {
  let component: NetworkImageComponent;
  let fixture: ComponentFixture<NetworkImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NetworkImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
