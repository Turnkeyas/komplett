import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FagsComponent } from './fags.component';

describe('FagsComponent', () => {
  let component: FagsComponent;
  let fixture: ComponentFixture<FagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
