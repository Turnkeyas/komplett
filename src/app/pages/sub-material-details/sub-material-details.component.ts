import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SUBMATERIAL_DATA } from 'src/app/core/constants/constants';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import {
  FormFacade,
  MasterMaterialFacade,
  SharedStateFacade,
  TableFacade,
} from 'src/app/states';
import { MaterialGroupsFacade } from 'src/app/states/administration/material-groups';

@Component({
  selector: 'app-sub-material-details',
  templateUrl: './sub-material-details.component.html',
  styleUrls: ['./sub-material-details.component.scss'],
})
export class SubMaterialDetailsComponent implements OnInit, OnDestroy {
  @Output() subMaterialValue = new EventEmitter();
  @Output() isFormSubmitted = new EventEmitter(false);

  getIsLoading: Observable<boolean> = this._tableFacade.isLoading$;
  getIsLoadingSharedState: Observable<boolean> = this._sharedStateFacade
    .isLoading$;
  getSubMaterialDetail: Observable<boolean> = this._sharedStateFacade
    .subMaterialDetail$;
  getMaterialGroups$: Observable<any> = this._materialGroupsFacade
    .materialGroups$;

  fagList$: Observable<any> = this._masterMaterialFacade.fagList$;
  fagList: Array<any>;
  subMaterialForm: FormGroup;
  isCollapsed = false;
  isLoading: boolean;
  isLoadingSharedState: boolean;
  private ngUnsubscribe = new Subject();

  subMaterialDetails: any;

  //sub Group
  subGroupsData: any[] = [];

  // add subMaterial
  isAddSubMaterial: boolean;
  isEditSubMaterial: boolean;
  isEditMasterMaterial: boolean;
  materialName: string;

  isApplicationCollapsed = true;
  isItemInfoCollapsed = false;
  isQuantityTimeCollapsed = false;
  selectedSubject: any;
  // subjectError: any;
  formsItem = [
    { name: 'Application', isCollapsed: true },
    { name: 'Vare Info', isCollapsed: false },
    { name: 'Quantity and Time', isCollapsed: false },
  ];

  units = [
    { unit: 'lm', name: 'lopemeter' },
    { unit: 'stk', name: 'stykk' },
    { unit: 'm2', name: 'kvadratmeter' },
    { unit: 'RS', name: 'rundsum' },
  ];

  subjectAreaUnits = [
    { unit: 'stalarbeider', name: '(standard) 0, 00' },
    { unit: 'metallarbeider', name: '(standard) 0, 00' },
  ];

  title: string;
  closeBtnName: string;
  list: any[] = [];

  //materialGroup
  materialGroupsData: any[];

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private _tableFacade: TableFacade,
    private _sharedStateFacade: SharedStateFacade,
    private _toastr: ToastrService,
    private _formFacade: FormFacade,
    private _masterMaterialFacade: MasterMaterialFacade,
    private modalService: BsModalService,
    private _sharedState: SharedStateFacade,
    private _materialGroupsFacade: MaterialGroupsFacade
  ) {}

  ngOnInit(): void {
    this._masterMaterialFacade.fetchFagData();
    this._materialGroupsFacade.fetchMaterialGroups(this.materialName);
    this.fnGetSubMaterialDetail();
    this.fnGetMaterialGroup();
    this.fnGetFagList();

    // get subscriptions
    this.fnGetIsLoading();
    this.fnGetIsLoadingSharedState();
  }

  fnGetFagList() {
    this.fagList$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((res) => {
      if (res && res.length) {
        this.fagList = res;
        if (!this.subMaterialDetails?.subjectDoc) {
          this.subMaterialDetails.subjectDoc = this.fagList[0];
        }
        this.createForm();
      }
    });
  }

  fnGetMaterialGroup() {
    this.getMaterialGroups$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        if (data) {
          this.materialGroupsData = data;
        }
      });
  }

  setSubGroupsData(groupId: string) {
    this.subGroupsData = this.materialGroupsData.find(
      (group) => group._id === groupId
    )?.subgroups;
  }

  fnGetSubMaterialDetail() {
    this.getSubMaterialDetail
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val: any) => {
        this.subMaterialDetails = val;
      });
  }

  fnGetIsLoading() {
    this.getIsLoading.pipe(takeUntil(this.ngUnsubscribe)).subscribe((val) => {
      this.isLoading = val;
    });
  }

  fnGetIsLoadingSharedState() {
    this.getIsLoadingSharedState
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        this.isLoadingSharedState = val;
      });
  }

  get formControls() {
    return this.subMaterialForm.controls;
  }

  createForm() {
    this.subMaterialForm = this.formBuilder.group({
      _id: [this.subMaterialDetails?._id],
      groupId: [this.subMaterialDetails?.groupId, [Validators.required]],
      subgroupId: [this.subMaterialDetails?.subgroupId],
      // subgroupId: [this.subMaterialDetails?.subgroupId, [Validators.required]],
      application: [
        this.subMaterialDetails?.application,
        [Validators.required],
      ],
      unit: [this.subMaterialDetails?.unit],
      itemPrice: [this.subMaterialDetails?.itemPrice],
      inverseFactor: [this.subMaterialDetails?.inverseFactor],
      subject: [this.subMaterialDetails?.subjectDoc?._id],
      subjectId: [this.subMaterialDetails?.subjectDoc?.id],
      subjectTitle: [this.subMaterialDetails?.subjectDoc?.id],
      NS3420: [this.subMaterialDetails?.NS3420],
      useListPrice: [this.subMaterialDetails?.useListPrice],
      quantity: this.formBuilder.group({
        type: [this.subMaterialDetails?.quantity?.type],
        inTotal: [this.subMaterialDetails?.quantity?.inTotal],
        quantityPerComponent: [
          this.subMaterialDetails?.quantity?.quantityPerComponent,
        ],
        svinn: [this.subMaterialDetails?.quantity?.svinn],
      }),
      time: this.formBuilder.group({
        hoursPerComponent: [this.subMaterialDetails?.time?.hoursPerComponent],
        minPerComponent: [this.subMaterialDetails?.time?.minPerComponent],
        totalTimeConsumption: [
          this.subMaterialDetails?.time?.totalTimeConsumption,
        ],
      }),
    });

    if (this.isAddSubMaterial) {
      // add time
      if (this.materialGroupsData && this.materialGroupsData[0]) {
        this.subMaterialForm
          .get('groupId')
          .setValue(this.materialGroupsData[0]._id);

        this.setSubGroupsData(this.materialGroupsData[0]._id);
      }
    } else {
      //edit time
      if (!this.subMaterialDetails?.groupId) {
        this.subMaterialForm
          .get('groupId')
          .setValue(this.materialGroupsData[0]._id);
        this.setSubGroupsData(this.materialGroupsData[0]._id);
      } else {
        this.setSubGroupsData(this.subMaterialDetails?.groupId);
      }
    }
  }

  onUploadFile(file: any, subMaterialDetails) {
    const formData = new FormData();
    formData.append('_id', this.subMaterialDetails?._id);
    formData.append('document', file);
    this._tableFacade
      .uploadDocumentInSubMaterial(formData, this.isEditMasterMaterial)
      .subscribe(
        (res) => {
          this._toastr.success('Document Upload Successfully', 'Success');
        },
        (err) => {
          this._toastr.error('Something went wrong', 'Error');
        }
      );
  }

  deleteFDVDocument() {
    const payload = { id: this.subMaterialDetails._id };
    this._sharedStateFacade
      .deleteFDVDocument(payload, this.isEditMasterMaterial)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (res) => {
          this._toastr.success('Document Deleted Successfully', 'Success');
        },
        (err) => {
          this._toastr.error('Something went wrong', 'Error');
        }
      );
    this.modalService.hide();
  }

  onChangeSubject(e, subjectVal?: any) {
    const subject = this.subMaterialForm.get('subject');
    const subjectId = this.subMaterialForm.get('subjectId');

    if (e.target.type == 'text') {
      const doc = this.fagList.find((fag) => subjectVal == fag.id);
      if (doc) {
        subject.setValue(doc._id);
        subjectId.setValue(doc.id);
      } else {
        // if any subject with typed id does not exits revert it
        this._toastr.warning('Fag with this id does not exits');
        if (this.subMaterialDetails.subjectDoc) {
          e.target.value = this.subMaterialDetails.subjectDoc.id;
        }
        subject.setValue(this.subMaterialDetails?.subjectDoc?._id);
        subjectId.setValue(this.subMaterialDetails?.subjectDoc?.id);
      }
    } else {
      const doc = this.fagList.find((fag) => subjectVal == fag._id);

      if (doc) {
        subject.setValue(doc._id);
        subjectId.setValue(doc.id);
      }
    }
  }

  toggleTab(tabName: any) {
    if (tabName === 'Application') {
      this.isApplicationCollapsed = !this.isApplicationCollapsed;
      this.isItemInfoCollapsed = false;
      this.isQuantityTimeCollapsed = false;
    } else if (tabName === 'ItemInfo') {
      this.isItemInfoCollapsed = !this.isItemInfoCollapsed;
      this.isApplicationCollapsed = false;
      this.isQuantityTimeCollapsed = false;
    } else if (tabName === 'QuantityAndTime') {
      this.isQuantityTimeCollapsed = !this.isQuantityTimeCollapsed;
      this.isApplicationCollapsed = false;
      this.isItemInfoCollapsed = false;
    }
  }

  closeModal() {
    this._formFacade.resetFormStateAction();
    this.bsModalRef.hide();
  }

  closeDeleteModal() {
    this.modalService.hide();
  }

  fnSaveDetail() {
    if (this.isAddSubMaterial && this.subMaterialForm.valid) {
      const payload = { ...this.subMaterialForm.value };
      delete payload._id;

      if (payload.subgroupId === null) {
        delete payload.subgroupId;
      }

      payload.category = this.materialName;

      this._masterMaterialFacade
        .addMasterMaterialData(payload)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (res) => {
            this._toastr.success('Master Material Added', 'Success');
            this._formFacade.resetFormStateAction();
            this.closeModal();
          },
          (err) => {
            this._toastr.error(
              err.error.message || 'Something went wrong',
              'Error'
            );
          }
        );
    }

    if (this.isEditSubMaterial) {
      const payload = {
        _id: this.subMaterialDetails._id,
        ...this.subMaterialForm.value,
      };
      this._formFacade.subMaterialFormSubmitAction(payload).subscribe(
        (res) => {
          if (res) {
            this._toastr.success('Data Updated Successfully');
            this._formFacade.resetFormStateAction();
            this.closeModal();
          }
        },
        (err) => {
          this._toastr.error(err.error.message || 'Something went wrong');
        }
      );
    }

    if (this.isEditMasterMaterial) {
      const payload = {
        _id: this.subMaterialDetails._id,
        ...this.subMaterialForm.value,
      };
      payload.category = this.materialName;
      if (payload.subgroupId === null) {
        delete payload.subgroupId;
      }

      this._masterMaterialFacade
        .editMasterMaterialData(payload)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (res) => {
            this._toastr.success('Data Updated Successfully', 'Success');
            this._formFacade.resetFormStateAction();
            this.closeModal();
          },
          (err) => {
            this._toastr.error(
              err.error.message || 'Something went wrong',
              'Error'
            );
          }
        );
    }
  }

  private fnResetSubMaterialFormState() {
    this._formFacade.updateFormValue({}, 'form.subMaterial');
  }

  openDeleteModal(modal: any, payload: any, isDeletingSubMaterial: boolean) {
    const config: ModalOptions = {
      class: 'cm-modal',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(modal, config);
  }

  getTotal(): number {
    const {
      quantityPerComponent,
      svinn,
    } = this.subMaterialForm.controls.quantity.value;

    return quantityPerComponent + (quantityPerComponent * svinn) / 100;
  }

  ngOnDestroy() {
    this._sharedState.addSubMaterialDetail(SUBMATERIAL_DATA);
    this.fnResetSubMaterialFormState();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
