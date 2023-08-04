import {
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import { MasterMaterialFacade, TableFacade } from 'src/app/states';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
})
export class MaterialComponent implements OnInit, OnDestroy {
  subMaterialListData: Observable<any> = this._materialFacade
    .subMaterialListData$;
  getIsLoading: Observable<boolean> = this._materialFacade.isLoading$;
  getActiveTableName: Observable<string> = this._tableFacade.activeTableName$;

  isLoading: boolean;
  activeTableName: any;
  isEditMode: Boolean;
  subMaterialDetails: any;
  list;
  public materialForm: FormGroup;
  public subMaterialsList: Subject<any> = new Subject<any>();
  private ngUnsubscribe = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    private _materialFacade: MasterMaterialFacade,
    private _toastr: ToastrService,
    private _tableFacade: TableFacade
  ) {}

  ngOnInit(): void {
    this.createMaterialForm();
    this.fnGetActiveTableName();

    this._materialFacade.fetchSubMaterialData(this.activeTableName.value);

    this.fnGetIsLoading();
    this.fnGetSubMaterialList();
  }

  fnGetActiveTableName() {
    this.getActiveTableName.subscribe((res) => {
      //   this.activeTableName = res;
    });
  }

  fnGetSubMaterialList() {
    let subMaterialList = [];
    this.subMaterialListData
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((list) => {
        list = list[0]?.data;
        subMaterialList = [];
        if (list) {
          list.forEach((data) => {
            const subMaterials = this.subMaterialDetails.subMaterials;
            let flag;
            if (subMaterials && subMaterials.length) {
              subMaterials.forEach((element) => {
                if (element.application === data.application) {
                  flag = true;
                }
              });
            }
            if (!flag) {
              subMaterialList.push({
                id: data._id,
                name: data.application,
                groupName: data.groupDoc ? data.groupDoc?.name : '',
                subgroupName: data.subgroupDoc ? data.subgroupDoc?.name : '',
              });
            }
          });
          function compareName(a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          }

          function compare(a, b) {
            var aSize = a.groupName;
            var bSize = b.groupName;
            var aLow = a.subgroupName;
            var bLow = b.subgroupName;
            if (aSize == bSize) {
              return aLow < bLow ? -1 : aLow > bLow ? 1 : 0;
            } else {
              return aSize < bSize ? -1 : 1;
            }
          }

          this.list = subMaterialList.sort(compareName).sort(compare)
          this.subMaterialsList.next(subMaterialList);
        }
      });
  }

  fnGetIsLoading() {
    this.getIsLoading.pipe(takeUntil(this.ngUnsubscribe)).subscribe((val) => {
      this.isLoading = val;
    });
  }

  createMaterialForm() {
    if (!this.isEditMode) {
      this.materialForm = this.formBuilder.group({
        buildingComponents: ['', [Validators.required]],
        subMaterials: [[], [Validators.required]],
        quantity: ['', [Validators.required]],
      });
    } else {
      this.materialForm = this.formBuilder.group({
        subMaterials: [[], [Validators.required]],
        quantity: ['', [Validators.required, Validators.min(0)]],
      });
    }
  }

  get controls() {
    return this.materialForm.controls;
  }

  fnAddMaterial() {
    const formValue = this.materialForm.value;
    if (!this.isEditMode) {
      const payload: any = {
        subMaterials: formValue.subMaterials,
        buildingComponents: formValue.buildingComponents,
        type: this.activeTableName.value,
        index: this.activeTableName.index,
        quantity: formValue.quantity,
      };
      if (this.activeTableName.division !== 'All') {
        payload.division = this.activeTableName.division;
      }
      this._materialFacade.addMaterialData(payload).subscribe(
        (res) => {
          this._toastr.success('Section Added', 'Success');
          this.closeModal();
        },
        (err) => {
          this._toastr.warning(
            err.error.message || 'Something went wrong',
            'Error'
          );
        }
      );
    } else {
      const payload = {
        subMaterials: formValue.subMaterials,
        materialId: this.subMaterialDetails._id,
        quantity: formValue.quantity,
        index: this.activeTableName.index,
      };
      this._materialFacade.addSubMaterials(payload).subscribe(
        (res) => {
          this._toastr.success('Section Updated', 'Success');
          this.closeModal();
        },
        (err) => {
          this._toastr.warning(
            err.error.message || 'Something went wrong',
            'Error'
          );
        }
      );
    }
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
