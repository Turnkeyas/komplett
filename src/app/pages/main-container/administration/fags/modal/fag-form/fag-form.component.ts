import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import { FagsFacade } from 'src/app/states';
import { CompanySettingsFacade } from 'src/app/states/administration/company-settings';

@Component({
  selector: 'app-fag-form',
  templateUrl: './fag-form.component.html',
  styleUrls: ['./fag-form.component.scss']
})

export class FagFormComponent implements OnInit, OnDestroy {
  @Input() fagDetails;
  @Input() isEditMode;
  @Input() fagList;
  public fagForm: FormGroup;
  isLoading: boolean;
  netSalary: number;

  prevHourlyRate: any;

  isLoading$: Observable<boolean> = this._fagFacade.isLoading$;
  companySettings$: Observable<any> = this._companySettingsFacade.getCompanySettings$;
  private ngUnSubscribe: Subject<any> = new Subject();

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private _fagFacade: FagsFacade,
    private _toastr: ToastrService,
    private _companySettingsFacade: CompanySettingsFacade
  ) { }

  async ngOnInit() {
    this.fnGetIsLoading();
    this.fnGetCompanySettings();
  }

  fnGetIsLoading(): void {
    this.isLoading$.pipe(takeUntil(this.ngUnSubscribe)).subscribe(res => {
      this.isLoading = res;
    });
  }

  fnGetCompanySettings() {
    this._companySettingsFacade.fetchCompanySettings();
    this.companySettings$.pipe(takeUntil(this.ngUnSubscribe)).subscribe((res: any) => {
      this.netSalary = res?.netSalary
      this.prevHourlyRate = this.fagDetails?.hourlyRate;
      this.createForm();
    });
  }

  createForm() {
    this.fagForm = this.formBuilder.group({
      id: [this.fagDetails?.id, Validators.required],
      description: [this.fagDetails?.description, Validators.required],
      // hourlyRate: [this.fagDetails?.hourlyRate, Validators.required],
      hourlyRate: [this.isEditMode ? this.fagDetails?.hourlyRate : this.netSalary, Validators.required],
      isDefault: [this.isEditMode ? this.fagDetails?.isDefault : true]
    });
  }

  get controls() {
    return this.fagForm.controls;
  }

  checkIdIsUnique(event) {
    const target = event.target.value;
    this.fagList.forEach(e => {
      if (target == e.id) {
        if (this.isEditMode && this.fagDetails._id === e._id) {
          return;
        }
        this.controls.id.setErrors({
          notUnique: true
        });
      }
    })
    // this.controls.id.setErrors()
  }

  confirmClick() {
    const data = {
      ...this.fagForm.value,
      _id: this.fagDetails?._id,
    };

    if (this.isEditMode) {
      this._fagFacade.updateFag(data).subscribe(res => {
        this._toastr.success('Fag Updated Successfully', 'Successful');
        this.closeModal();
      }, err => {
        this._toastr.error(err.error.message || 'Something Went Wrong', 'Error');
      });
    } else {
      this._fagFacade.insertFag(data).subscribe(res => {
        this._toastr.success('Fag Inserted Successfully', 'Successful');
        this.bsModalRef.hide();
      }, err => {
        this._toastr.error(err.error.message || 'Something Went Wrong', 'Error');
      });
    }
  }

  onIsDefaultChange(isDefault: any) {
    const hourlyRateFormField = this.fagForm.get('hourlyRate');
    if (isDefault) {
      hourlyRateFormField.setValue(this.netSalary);
    } else {
      hourlyRateFormField.setValue(this.prevHourlyRate);
    }
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  ngOnDestroy() {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}
