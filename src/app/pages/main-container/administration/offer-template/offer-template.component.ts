import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import { SharedStateFacade } from 'src/app/states';

@Component({
  selector: 'app-offer-template',
  templateUrl: './offer-template.component.html',
  styleUrls: ['./offer-template.component.scss']
})
export class OfferTemplateComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = this._sharedStateFacade.isLoading$;
  getOfferTemplate$: Observable<any> = this._sharedStateFacade.getOfferTemplate$;
  private ngUnSubscribe: Subject<any> = new Subject();

  tableCols = [
    { title: 'Title', value: 'title', isInputField: false },
    { title: 'Surcharge Materials', value: 'surchargeMaterials', isInputField: true },
    { title: 'Surcharge Works', value: 'surchargeWorks', isInputField: true }
  ];

  mockOfferTemplate: any[];
  offerTemplate: Array<any> = [];
  isLoading: boolean = false;

  constructor(
    private _sharedStateFacade: SharedStateFacade,
    private _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.fnGetIsLoading();
    this.fnGetOfferTemplate();
  }

  fnGetIsLoading(): void {
    this.isLoading$.pipe(takeUntil(this.ngUnSubscribe)).subscribe(res => {
      this.isLoading = res;
    });
  }

  fnGetOfferTemplate(): void {
    this._sharedStateFacade.fetchOfferTemplate();
    this.getOfferTemplate$.pipe(takeUntil(this.ngUnSubscribe)).subscribe((data: any) => {
      if (data && data.length) {
        this.offerTemplate = data;
        this.mockOfferTemplate = JSON.parse(JSON.stringify(data));
      }
    });
  }

  onBlur(template: any, ref: any, matchingString: string) {
    if (!ref.errors) {
      const findTemplate = this.mockOfferTemplate.find(data => data._id === template._id);
      if (findTemplate[matchingString] !== template[matchingString]) {
        this._sharedStateFacade.updateOfferTemplate(template)
          .pipe(takeUntil(this.ngUnSubscribe)).subscribe(
            (res: any) => {
              this._toastr.success('Surcharge Updated', 'Success');
            }, (err: any) => {
              this._toastr.error('Somethoing went wrong', 'Error');
            });
        findTemplate[matchingString] = template[matchingString];
      }
    }
  }

  ngOnDestroy() {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}
