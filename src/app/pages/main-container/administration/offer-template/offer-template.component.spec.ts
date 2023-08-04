import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferTemplateComponent } from './offer-template.component';

describe('OfferTemplateComponent', () => {
  let component: OfferTemplateComponent;
  let fixture: ComponentFixture<OfferTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
