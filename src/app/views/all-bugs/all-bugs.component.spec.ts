import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBugsComponent } from './all-bugs.component';

describe('AllBugsComponent', () => {
  let component: AllBugsComponent;
  let fixture: ComponentFixture<AllBugsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllBugsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
