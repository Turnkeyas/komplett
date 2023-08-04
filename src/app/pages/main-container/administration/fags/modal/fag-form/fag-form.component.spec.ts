import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FagFormComponent } from './fag-form.component';

describe('FagFormComponent', () => {
  let component: FagFormComponent;
  let fixture: ComponentFixture<FagFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FagFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FagFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
