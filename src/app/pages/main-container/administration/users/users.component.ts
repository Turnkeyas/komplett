import { Component, OnDestroy, OnInit } from '@angular/core';
import { InitialState } from '@ngxs/store/internals';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
// import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, pipe, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import { AdminUsersFacade } from 'src/app/states';
import { USERROLES } from '../../../../core/constants/constants';
import { UserDeleteComponent } from './modal/user-delete/user-delete.component';
import { UserFormComponent } from './modal/user-form/user-form.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  USERROLES = USERROLES;
  rolesDropDownKeys;

  usersList$: Observable<any> = this._adminUsersFacade.users$;
  userList: Array<any> = [];
  isLoading$: Observable<boolean> = this._adminUsersFacade.isLoading$;
  isLoading: boolean = false;
  selectedRole: string = USERROLES.ALL;
  private ngUnSubscribe: Subject<any> = new Subject();


  /** table */
  tableColumns = [
    { name: 'Name', key: 'name' },
    { name: 'Email', key: 'email' },
    { name: 'Role', key: 'role' },
  ];
  sortMethod = 'createdAt';
  sortAscending = false;
  sortedColumnsIndex = -1;

  limit = 10;
  metaData;
  page = 1;
  bsModalRef: BsModalRef;


  constructor(
    private _adminUsersFacade: AdminUsersFacade,
    private modalService: BsModalService,
    private _toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.createRolesDropDownKeys();
    this.fnGetIsLoading();
    this.fnGetUserList();
    this.fetchUsersData();
  }

  fnGetIsLoading(): void {
    this.isLoading$.pipe(takeUntil(this.ngUnSubscribe)).subscribe(res => {
      this.isLoading = res;
    });
  }

  fnGetUserList(): void {
    this.usersList$.pipe(takeUntil(this.ngUnSubscribe)).subscribe((data: any) => {
      // this.userList = res;
      if (data && data.length) {
        const res = data[0];
        this.userList = res.data;
        this.metaData = res.metadata[0];
      }
    });
  }



  createRolesDropDownKeys() {
    this.rolesDropDownKeys = Object.keys(USERROLES);
    this.rolesDropDownKeys = this.rolesDropDownKeys.map((e, index) => {
      return {
        name: e,
        isSelected: index == 0 ? true : false
      }
    });
  }

  fetchUsers() {
    this._adminUsersFacade.fetchUsers();
  }

  onSelectionChange(e) {
    this.selectedRole = e.name;
    this.rolesDropDownKeys.forEach(list => {
      if (list.name === e.name) {
        list.isSelected = true;
      } else {
        list.isSelected = false;
      }
    });

    this.fetchUsersData();
  }


  /**table */
  sort(item, i) {
    if (i === this.sortedColumnsIndex) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = true;
    }
    this.sortedColumnsIndex = i;
    this.sortMethod = item.key;

    this.page = 1;
    this.fetchUsersData();
  }

  pageChange(e) {
    this.page = e.page;
    this.fetchUsersData();
  }


  fetchUsersData() {
    this._adminUsersFacade.setAdminUserFetchOption({
      limit: this.limit,
      page: this.page,
      order: this.sortAscending ? 'acs' : 'des',
      sort: this.sortMethod,
      role: this.selectedRole
    });
    this.fetchUsers();
  }


  /** modals */
  openFormModal(userDetails?) {
    const InitialState = {
      userDetails,
      rolesList: this.rolesDropDownKeys,
      // selectedRole: this.selectedRole,
      isEditMode: userDetails ? true : false,
    }
    // this.updateMaterialData = payload;
    const config: any = { class: 'cm-modal', ignoreBackdropClick: true, initialState: InitialState };
    this.bsModalRef = this.modalService.show(UserFormComponent, config);
  }

  openDeleteModal(userDetails) {
    const InitialState = {
      userDetails,
      selectedRole: this.selectedRole
    }
    // this.updateMaterialData = payload;
    const config: any = { class: 'cm-modal', ignoreBackdropClick: true, initialState: InitialState };
    this.bsModalRef = this.modalService.show(UserDeleteComponent, config);
  }

  ngOnDestroy() {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}
