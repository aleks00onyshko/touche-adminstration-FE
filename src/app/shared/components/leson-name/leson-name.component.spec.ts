import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LesonNameComponent } from './leson-name.component';

describe('LesonNameComponent', () => {
  let component: LesonNameComponent;
  let fixture: ComponentFixture<LesonNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LesonNameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LesonNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
