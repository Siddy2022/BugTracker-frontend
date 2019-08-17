import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBugsComponent } from './create-bugs.component';

describe('CreateBugsComponent', () => {
  let component: CreateBugsComponent;
  let fixture: ComponentFixture<CreateBugsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBugsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
