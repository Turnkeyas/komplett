import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMaterialDetailsComponent } from './sub-material-details.component';

describe('SubMaterialDetailsComponent', () => {
  let component: SubMaterialDetailsComponent;
  let fixture: ComponentFixture<SubMaterialDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubMaterialDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubMaterialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
