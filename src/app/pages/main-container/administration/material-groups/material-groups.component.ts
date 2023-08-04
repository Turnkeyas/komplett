import { group } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { processMenu } from 'src/app/providers/side-menu';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import { MaterialGroupsFacade } from 'src/app/states/administration/material-groups';

@Component({
  selector: 'app-material-groups',
  templateUrl: './material-groups.component.html',
  styleUrls: ['./material-groups.component.scss'],
})
export class MaterialGroupsComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = this._materialGroupsFacade.isLoading$;
  getMaterialGroups$: Observable<any> = this._materialGroupsFacade
    .materialGroups$;

  private ngUnSubscribe: Subject<any> = new Subject();

  isLoading: boolean = false;
  groupsTableCols: { title: string; value: string }[];
  subGroupsTableCols: { title: string; value: string }[];
  materialGroupsData: any[];
  categoriesList: any[] = processMenu;
  categoryDropdownName: string = 'all';
  editbaleGroup: any;
  editableSubgroup: any;
  isEditGroup: boolean = false;
  isEditSubgroup: boolean = false;
  visibleRowIndex = -1;
  selectedGroup: string;

  // sorting variables
  sortMethod = 'createdAt';
  sortAscending = false;
  sortedColumnsIndex = -1;

  //modal
  addGroupModalRef: BsModalRef;
  addSubgroupModalRef: BsModalRef;
  deleteGroupModalRef: BsModalRef;

  //form
  addGroupForm: FormGroup;
  addSubgroupForm: FormGroup;

  constructor(
    private _materialGroupsFacade: MaterialGroupsFacade,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _toastr: ToastrService
  ) {
    this.groupsTableCols = [
      { title: 'Group Name', value: 'name' },
      { title: 'Category', value: 'category' },
    ];
    this.subGroupsTableCols = [{ title: 'Sub Group Name', value: 'name' }];
  }

  ngOnInit(): void {
    this._materialGroupsFacade.fetchMaterialGroups('all');

    this.fnGetIsLoading();
    this.fnGetMaterialGroups();
    this.fnCreateForm();
    this.fnCreateSubgroupForm();
  }

  toggleSubgroup(group: any) {
    this.materialGroupsData.forEach((material) => {
      if (material._id === group._id) {
        material.isInnerTableShow = !material.isInnerTableShow;
      } else {
        material.isInnerTableShow = false;
      }
    });
  }

  fnCreateForm() {
    this.addGroupForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      category: [this.categoriesList[0]?.value, [Validators.required]],
    });
  }

  fnCreateSubgroupForm() {
    this.addSubgroupForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  get controls() {
    return this.addGroupForm.controls;
  }

  get subGontrols() {
    return this.addSubgroupForm.controls;
  }

  fnGetIsLoading(): void {
    this.isLoading$.pipe(takeUntil(this.ngUnSubscribe)).subscribe((res) => {
      this.isLoading = res;
    });
  }

  onCategoryChange(category: any) {
    this.categoryDropdownName = category;
    this._materialGroupsFacade.fetchMaterialGroups(category);
  }

  fnGetMaterialGroups(): void {
    this.getMaterialGroups$
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((data: any) => {
        if (data) {
          this.materialGroupsData = data;
        }
      });
  }

  sort(item, i) {
    if (i === this.sortedColumnsIndex) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = true;
    }
    this.sortedColumnsIndex = i;
    this.sortMethod = item.key;
  }

  openModal(template: any, isEditModal?: boolean, groupDetail?: any) {
    this.isEditGroup = isEditModal;

    if (this.isEditGroup) {
      this.editbaleGroup = groupDetail;

      this.addGroupForm.setValue({
        name: groupDetail?.name,
        category: groupDetail?.category,
      });
    }

    const config: ModalOptions = {
      class: 'cm-modal',
      ignoreBackdropClick: true,
    };
    this.addGroupModalRef = this.modalService.show(template, config);
  }

  openSubgroupModal(
    template: any,
    groupId: string,
    isEditModal?: boolean,
    subGroupDetail?: any
  ) {
    this.isEditSubgroup = isEditModal;
    this.selectedGroup = groupId;

    if (this.isEditSubgroup) {
      this.editableSubgroup = subGroupDetail;

      this.addSubgroupForm.setValue({
        name: subGroupDetail?.name,
      });
    }

    const config: ModalOptions = {
      class: 'cm-modal',
      ignoreBackdropClick: true,
    };
    this.addSubgroupModalRef = this.modalService.show(template, config);
  }

  onSubmit() {
    if (this.isEditGroup) {
      const payload = {
        _id: this.editbaleGroup._id,
        ...this.addGroupForm.value,
      };
      this.categoryDropdownName = this.addGroupForm.value.category;
      this._materialGroupsFacade.UpdateMaterialGroup(payload).subscribe(
        (res) => {
          this._toastr.success('Group Updated Successfully', 'Successful');
          this.closeModal();
        },
        (err) => {
          this._toastr.error(
            err.error.message || 'Something Went Wrong',
            'Error'
          );
        }
      );
    } else {
      const payload = { ...this.addGroupForm.value };
      this.categoryDropdownName = this.addGroupForm.value.category;
      this._materialGroupsFacade.AddMaterialGroup(payload).subscribe(
        (res) => {
          this._toastr.success('Group Added Successfully', 'Successful');
          this.closeModal();
        },
        (err) => {
          this._toastr.error(
            err.error.message || 'Something Went Wrong',
            'Error'
          );
        }
      );
    }
  }

  onSubgroupSubmit() {
    const payload = {
      ...this.addSubgroupForm.value,
      groupId: this.selectedGroup,
      category: this.categoryDropdownName,
    };
    if (this.isEditSubgroup) {
      payload._id = this.editableSubgroup._id;
    }
    if (this.isEditSubgroup) {
      this._materialGroupsFacade.updateMaterialSubGroup(payload).subscribe(
        (res) => {
          this._toastr.success('Subgroup Updated Successfully', 'Successful');
          this.closeModal();
        },
        (err) => {
          this._toastr.error(
            err.error.message || 'Something Went Wrong',
            'Error'
          );
        }
      );
    } else {
      this._materialGroupsFacade.addMaterialSubGroup(payload).subscribe(
        (res) => {
          this._toastr.success('Subgroup Added Successfully', 'Successful');
          this.closeSubgroupModal();
        },
        (err) => {
          this._toastr.error(
            err.error.message || 'Something Went Wrong',
            'Error'
          );
        }
      );
    }
  }

  closeModal() {
    this.addGroupForm.reset();
    this.addGroupModalRef.hide();
  }

  closeSubgroupModal() {
    this.addSubgroupForm.reset();
    this.addSubgroupModalRef.hide();
    this.selectedGroup = '';
  }

  openDeleteModal(
    data: any,
    title: string,
    isMaterialSubGroupDelete?: boolean
  ) {
    const initialState = {
      title,
      message: 'Are you sure you want to delete this?',
      confirmBtnName: 'Delete',
    };

    const config: any = {
      class: 'cm-modal',
      ignoreBackdropClick: true,
      initialState: initialState,
    };

    this.deleteGroupModalRef = this.modalService.show(
      ConfirmationModalComponent,
      config
    );

    this.deleteGroupModalRef.content.onConfirm.subscribe((val) => {
      if (val) {
        if (isMaterialSubGroupDelete) {
          this.deleteMaterialSubGroup(data);
        } else {
          this.deleteGroup(data);
        }
      }
    });
  }

  deleteGroup(groupDetail: any) {
    this.deleteGroupModalRef.content.isLoading = true;
    const payload = {
      id: groupDetail?._id,
      category: this.categoryDropdownName,
    };
    this._materialGroupsFacade.DeleteMaterialGroup(payload).subscribe(
      (res) => {
        this._toastr.success('Group Deleted Successfully', 'Successful');
        this.deleteGroupModalRef.content.isLoading = false;
      },
      (err) => {
        this._toastr.error(
          err.error.message || 'Something Went Wrong',
          'Error'
        );
        this.deleteGroupModalRef.content.isLoading = false;
      }
    );
  }

  deleteMaterialSubGroup(subGroup: any) {
    this.deleteGroupModalRef.content.isLoading = true;
    const payload = {
      id: subGroup?._id,
      category: this.categoryDropdownName,
    };
    this._materialGroupsFacade.deleteMaterialSubGroup(payload).subscribe(
      (res) => {
        this._toastr.success('Sub Group Deleted Successfully', 'Successful');
        this.deleteGroupModalRef.content.isLoading = false;
      },
      (err) => {
        this._toastr.error(
          err.error.message || 'Something Went Wrong',
          'Error'
        );
        this.deleteGroupModalRef.content.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}
