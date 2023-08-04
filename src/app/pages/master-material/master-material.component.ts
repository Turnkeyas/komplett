import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import { MasterMaterialFacade, SharedStateFacade, TableFacade } from 'src/app/states';
import { SubMaterialDetailsComponent } from '../sub-material-details/sub-material-details.component';
import { processMenu } from '../../providers/side-menu';
import { MaterialGroupsFacade } from 'src/app/states/administration/material-groups';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-master-material',
  templateUrl: './master-material.component.html',
  styleUrls: ['./master-material.component.scss']
})
export class MasterMaterialComponent implements OnInit, OnDestroy {
  getMasterMaterialData: Observable<any> = this._masterMaterialFacade.masterMaterialData$;
  getIsLoading: Observable<boolean> = this._masterMaterialFacade.isLoading$;
  getIsDocumentUploading: Observable<boolean> = this._tableFacade.getIsDocumentUploading$;
  getMaterialGroups$: Observable<any> = this._materialGroupsFacade.materialGroups$;

  apiParams: any = {
    type: "",
    page: "1",
    groupId: ""
  }

  // public masterMaterialForm: FormGroup;
  masterMaterialName: string;
  isLoading: boolean;
  modalRef: BsModalRef;
  disableAddButton: boolean;
  isDocumentUploading: boolean;
  subMaterialDetailId: any;
  materialGroupsData: any[];
  selectedGroup: any;

  private ngUnsubscribe = new Subject();

  sortMethod = 'createdAt';
  // sortAscending = false;
  sortedColumnsIndex = -1;

  limit = 10;
  metaData;
  page = 1;
  apiData = [];
  deleteRow: any;
  apiUrl = 'http://192.168.0.119:3000/api/customer';

  columns = [
    { name: 'Fag', key: 'subject' },
    { name: 'Anvendelse', key: 'application' },
    { name: 'Enhet', key: 'unit' },
    { name: 'Group', key: 'groupDoc', isGroupField: true },
    { name: 'Varepris', key: 'itemPrice' },
    { name: 'Min. pr. byggdel', key: 'time' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private _sharedState: SharedStateFacade,
    private _masterMaterialFacade: MasterMaterialFacade,
    private _tableFacade: TableFacade,
    private _toastr: ToastrService,
    private modalService: BsModalService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _materialGroupsFacade: MaterialGroupsFacade,
    private _translatePipe: TranslatePipe
  ) { }

  ngOnInit(): void {

    this.fnGetIsLoading();
    this.fnGetIsDocumentUploading();
    this.fnGetMaterialGroups();
    this.getType();

    if (this.materialGroupsData && this.materialGroupsData.length) {
      this.selectedGroup = this.materialGroupsData[0];
    }
  }

  fnGetIsLoading() {
    this.getIsLoading.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        this.isLoading = val;
      });
  }

  fnGetIsDocumentUploading() {
    this.getIsDocumentUploading.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        this.isDocumentUploading = val;
      });
  }

  fnGetMaterialGroups(): void {
    this.getMaterialGroups$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: any) => {
      if (data) {
        this.materialGroupsData = JSON.parse(JSON.stringify(data));
        this.materialGroupsData.unshift({ name: 'All', _id: 'all' })

        this.selectedGroup = this.materialGroupsData.find(data => data._id === this.apiParams.groupId);
      }
    });
  }

  onCategoryChange(groupDetail: any) {
    if (groupDetail) {
      this.selectedGroup = groupDetail;

      this.apiParams.groupId = groupDetail._id;
      this.setQueryParam(Object.assign([], this.apiParams));
      this.fetchMasterMaterialData(this.masterMaterialName);
    }
  }

  getType(): any {
    this._route.url.pipe(
      withLatestFrom(this._route.paramMap, this._route.queryParamMap)
    ).subscribe(([url, paramMap, queryParamMap]) => {
      const menuObj = processMenu.find(o => o.routerLink === paramMap.get('type'))
      this.masterMaterialName = menuObj.value;

      this._materialGroupsFacade.fetchMaterialGroups(this.masterMaterialName);

      let tempQueryParams: any = {};
      if (Object.keys(queryParamMap['params']).length) {
        tempQueryParams = queryParamMap['params'];
      } else {
        tempQueryParams = this.apiParams;
        this.apiParams.groupId = 'all';
        this.setQueryParam(Object.assign([], tempQueryParams));
      }

      this.sortedColumnsIndex = this.columns.findIndex(o => o.key === tempQueryParams.sort);
      this.apiParams = { type: menuObj.value, ...tempQueryParams }

      if (this.apiParams) {
        if (this.apiParams.page) {
          this.page = +this.apiParams.page;
        }
        // if (this.apiParams.groupId) {
        //   this.selectedGroup = this.materialGroupsData.find(data => data._id === this.apiParams.groupId);
        // }
      }
      this.fetchMasterMaterialData(this.masterMaterialName)
    });
  }

  setQueryParam(params) {
    delete params.type;
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  openAddSubMaterialModal() {
    const materialGroupData = this.materialGroupsData.filter(data => data.name !== 'All');
    if (materialGroupData && materialGroupData.length) {
      const initialState = {
        isAddSubMaterial: true,
        materialName: this.masterMaterialName
      };

      const config: any = { class: 'cm-modal-x1', ignoreBackdropClick: true, initialState: initialState };
      this.modalRef = this.modalService.show(SubMaterialDetailsComponent, config);
    } else {
      this._toastr.info(this._translatePipe.transform(`messages.masterMaterialGroupRequired`), this._translatePipe.transform(`messages.groupRequire`));
    }
  }

  openUpdateModel(row) {
    const initialState = {
      subMaterialDetails: row,
      materialName: this.masterMaterialName,
      isEditMasterMaterial: true
    };

    this._sharedState.addSubMaterialDetail(row);

    const config: any = { class: 'cm-modal-x1', ignoreBackdropClick: true, initialState: initialState };
    this.modalRef = this.modalService.show(SubMaterialDetailsComponent, config);
  }

  fetchMasterMaterialData(masterMaterialName: string) {
    this.masterMaterialName = masterMaterialName;
    this._masterMaterialFacade.setMasterMaterialFetchOption({
      limit: this.limit,
      page: this.apiParams.page,
      order: this.apiParams.order,
      sort: this.apiParams.sort,
      category: masterMaterialName,
      groupId: this.apiParams.groupId
    });

    this._masterMaterialFacade.fetchMasterMaterialData();

    this.getMasterMaterialData.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data) {
          const res = data[0];
          if (res) {
            this.apiData = res.data;
            this.metaData = res.metadata[0];
          }
        }
      });
  }

  openDeleteModal(deleteModalTemplate: TemplateRef<any>, row) {
    this.deleteRow = row;
    this.modalRef = this.modalService.show(deleteModalTemplate, { class: 'modal-md modal-center', initialState: row });
  }

  sort(item, i) {
    if (i === this.sortedColumnsIndex) {
      this.apiParams.order = this.apiParams.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.apiParams.order = 'asc';
    }
    this.sortedColumnsIndex = i;
    this.apiParams.sort = item.key;
    this.apiParams.page = 1;
    this.setQueryParam(Object.assign([], this.apiParams));
    this.fetchMasterMaterialData(this.masterMaterialName)
  }

  pageChange(e) {
    this.apiParams.page = e.page;
    this.setQueryParam(Object.assign([], this.apiParams));
    this.fetchMasterMaterialData(this.masterMaterialName)
  }

  decline(): void {
    this.modalRef.hide();
  }

  confirm(): void {
    this._masterMaterialFacade.deleteMasterMaterialData(this.deleteRow._id).subscribe(res => {
      this._toastr.success('Material Deleted', 'Success');
      this.deleteRow = '';
    }, err => {
      this._toastr.error('something went wrong', 'Error');
    });
    this.modalRef.hide();
  }

  onfileChange(input: any, subMaterialDetail: any) {
    if (input.files.length && subMaterialDetail) {
      this.subMaterialDetailId = subMaterialDetail._id;
      const formData = new FormData();
      formData.append('_id', subMaterialDetail._id);
      formData.append('document', input.files[0]);
      this._tableFacade.uploadDocumentInSubMaterial(formData, true).subscribe(
        res => {
          this._toastr.success('Document Upload Successfully', 'Success');
        }, err => {
          this._toastr.error('Something went wrong', 'Error');
        })
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
