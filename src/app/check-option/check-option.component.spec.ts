import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOptionComponent } from './check-option.component';

describe('CheckOptionComponent', () => {
  let component: CheckOptionComponent;
  let fixture: ComponentFixture<CheckOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckOptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
