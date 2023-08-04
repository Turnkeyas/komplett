import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FagDeleteComponent } from './fag-delete.component';

describe('FagDeleteComponent', () => {
  let component: FagDeleteComponent;
  let fixture: ComponentFixture<FagDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FagDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FagDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
