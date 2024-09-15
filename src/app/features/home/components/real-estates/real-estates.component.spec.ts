import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstatesComponent } from './real-estates.component';

describe('ApartmentsComponent', () => {
  let component: RealEstatesComponent;
  let fixture: ComponentFixture<RealEstatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealEstatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealEstatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
