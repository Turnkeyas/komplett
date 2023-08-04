import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import { CompanySettingsFacade } from 'src/app/states/administration/company-settings';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss']
})
export class CompanySettingsComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = this._companySettingsFacade.isLoading$;
  companySettings$: Observable<any> = this._companySettingsFacade.getCompanySettings$;
  private ngUnSubscribe: Subject<any> = new Subject();

  isLoading: boolean;
  companySettings: any;
  companySettingsForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _companySettingsFacade: CompanySettingsFacade,
    private _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.fnGetIsLoading();
    this.fnGetCompanySettings();
  }

  fnCreateCompanySettingsForm() {
    this.companySettingsForm = this.formBuilder.group({
      netSalary: [this.companySettings?.netSalary, [Validators.required, Validators.min(0)]],
      socialExpenses: [this.companySettings?.socialExpenses, [Validators.required, Validators.min(0)]],
      employersTax: [this.companySettings?.employersTax, [Validators.required, Validators.min(0)]],
      operatingCosts: [this.companySettings?.operatingCosts, [Validators.required, Validators.min(0)]],
      totalCostPerHour: [this.companySettings?.totalCostPerHour, [Validators.required, Validators.min(0)]],
      valueAddedTax: [this.companySettings?.valueAddedTax, [Validators.required, Validators.min(0)]],
      valueIncrease: [this.companySettings?.valueIncrease, [Validators.required, Validators.min(0)]],
      surchargeMaterial: [this.companySettings?.surchargeMaterial, [Validators.required, Validators.min(0)]],
      surchargeWork: [this.companySettings?.surchargeWork, [Validators.required, Validators.min(0)]]
    });
  }

  fnGetIsLoading(): void {
    this.isLoading$.pipe(takeUntil(this.ngUnSubscribe)).subscribe(res => {
      this.isLoading = res;
    });
  }

  fnGetCompanySettings() {
    this._companySettingsFacade.fetchCompanySettings();
    this.companySettings$.pipe(takeUntil(this.ngUnSubscribe)).subscribe((res: any) => {
      this.companySettings = res;
      this.fnCreateCompanySettingsForm();
    });
  }

  get controls() {
    return this.companySettingsForm.controls;
  }

  setTotalCostPerHour() {
    const formValues = this.companySettingsForm.value;

    const fields = ['socialExpenses', 'employersTax', 'operatingCosts'];
    let costPerHour = 0;
    fields.forEach(field => {
      costPerHour += (formValues[field] * formValues['netSalary']) / 100;
    })

    this.companySettingsForm.get('totalCostPerHour').setValue(+costPerHour + +formValues['netSalary']);
  }

  updateCompanySettings() {
    this.setTotalCostPerHour();

    const payload = { _id: this.companySettings._id, ...this.companySettingsForm.value }
    this._companySettingsFacade.updateCompanySettings(payload)
      .pipe(takeUntil(this.ngUnSubscribe)).subscribe(
        (res: any) => {
          this._toastr.success('Company Settings Updated', 'Success');
        }, (err: any) => {
          this._toastr.error('Somethoing went wrong', 'Error');
        });;
  }

  ngOnDestroy() {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}
