import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnObservableX1Component } from './learn-observable-x1.component';

describe('LearnObservableX1Component', () => {
  let component: LearnObservableX1Component;
  let fixture: ComponentFixture<LearnObservableX1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnObservableX1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnObservableX1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
