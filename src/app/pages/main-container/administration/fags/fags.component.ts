import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'src/app/shared/services/toastr-sevice/toastr.service';
import { FagDeleteAction, FagsFacade, FagsService } from 'src/app/states';
import { takeUntil } from 'rxjs/operators';
import { FagFormComponent } from './modal/fag-form/fag-form.component';
import { FagDeleteComponent } from './modal/fag-delete/fag-delete.component';

@Component({
  selector: 'app-fags',
  templateUrl: './fags.component.html',
  styleUrls: ['./fags.component.scss']
})
export class FagsComponent implements OnInit, OnDestroy {

  isLoading$: Observable<boolean> = this._fagFacade.isLoading$;

  isLoading: boolean = false;
  isFagUsed: boolean;
  fagsList$: Observable<any> = this._fagFacade.fags$;
  fagList: Array<any> = [];
  isFagDeleteDisable: boolean;
  private ngUnSubscribe: Subject<any> = new Subject();

  bsModalRef: BsModalRef;

  tableColumns = [
    { name: 'Id', key: 'id' },
    { name: 'Description', key: 'description' },
    { name: 'Hourly Rate', key: 'hourlyRate' },
  ];

  constructor(
    private modalService: BsModalService,
    private _toastr: ToastrService,
    private _fagFacade: FagsFacade,
    private _fagService: FagsService
  ) { }

  ngOnInit(): void {
    this.fetchFags();
    this.fnGetIsLoading();
    this.fnGetFetchList();
  }


  fetchFags() {
    this._fagFacade.fetchFags();
  }

  fnGetFetchList(): void {
    this.fagsList$.pipe(takeUntil(this.ngUnSubscribe)).subscribe((data: any) => {
      // this.userList = res;
      if (data && data.length) {
        this.fagList = data;
      }

      if (data.length === 1) {
        this.isFagDeleteDisable = true;
      }
    });
  }

  fnGetIsLoading(): void {
    this.isLoading$.pipe(takeUntil(this.ngUnSubscribe)).subscribe(res => {
      this.isLoading = res;
    });
  }

  /** modals */
  openFormModal(fagDetails?) {
    const InitialState = {
      fagDetails,
      fagList: this.fagList,
      isEditMode: fagDetails ? true : false,
    }
    // this.updateMaterialData = payload;
    const config: any = { class: 'cm-modal', ignoreBackdropClick: true, initialState: InitialState };
    this.bsModalRef = this.modalService.show(FagFormComponent, config);
  }

  async openDeleteModal(fagDetails: any) {
    const checkFagUsage: any = await this._fagService.checkFagUsage(fagDetails._id);
    this.isFagUsed = checkFagUsage.isUsed;

    const InitialState = {
      fagList: this.fagList,
      fagDetails,
      isFagUsed: this.isFagUsed,
    }

    // this.updateMaterialData = payload;
    const config: any = { class: 'cm-modal', ignoreBackdropClick: true, initialState: InitialState };
    this.bsModalRef = this.modalService.show(FagDeleteComponent, config);
  }

  ngOnDestroy() {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}
