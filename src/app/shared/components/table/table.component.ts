import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { __createBinding } from 'tslib';
import { menuItems } from '../../../providers/side-menu';
import {
  MasterMaterialFacade,
  SharedState,
  SharedStateFacade,
  TableFacade,
  TableStateModel,
} from 'src/app/states';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SubMaterialDetailsComponent } from '../../../pages/sub-material-details/sub-material-details.component';
import { MaterialComponent } from '../../../pages/material/material.component';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { ToastrService } from '../../services/toastr-sevice/toastr.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TableSectionsService } from './table-sections.service';
import { TranslateService } from '@ngx-translate/core';
import { ReportFacade } from 'src/app/states/report/report.facade';
import { processMenu, divisionMenu } from '../../../providers/side-menu';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ClientFormComponent } from '../../../pages/client-form/client-form.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = this._tableFacade.isLoading$;
  tableData$: Observable<TableStateModel> = this._tableFacade.tableData$;
  reportData$: Observable<any> = this._reportFacade.getReportdata$;

  activeItem: any = {};
  apiData: Subject<any> = new Subject();
  columns = ['quantity', 'buildingComponents', 'code', 'level'];
  removeCol: Array<String> = ['_id', '__v', 'subMaterials'];
  limit = 10;
  limitOptions = [10, 50, 100, 'All'];
  currentPage;
  sortMethod = 'order';
  sortAscending = true;
  sortedColumnsIndex = 1;
  visibleRowIndex = -1;

  updateMaterialForm: FormGroup;
  updateMaterialData: any;
  deleteMaterialId: string;
  deleteMaterialName: string;
  deleteSubMaterialId: string;
  deleteSubMaterialName: string;

  duplicateObj: any;
  duplicateDivision: null;

  bsModalRef: BsModalRef;

  columnNames = [
    { title: 'Quantity', value: 'quantity', isEditable: true },
    { title: 'Building Components', value: 'buildingComponents' },
    { title: 'Code', value: 'code' },
    { title: 'Level', value: 'level' },
    { title: 'Category', value: 'division' },
  ];

  categoryList = divisionMenu;

  subColumnNames = [
    'Subject',
    'NS3420',
    'Application',
    'Unit',
    'Item Price',
    'Time (m)',
  ];

  subMaterialColumns = [
    'subject',
    'NS3420',
    'application',
    'unit',
    'itemPrice',
    'time',
  ];

  private ngUnsubscribe = new Subject();

  tableData: any;
  metaData: any;
  isLoading: Boolean = false;
  isDeletingSubMaterial: Boolean = false;
  pdfTableColumns = [
    { title: 'Building Components', value: 'buildingComponents' },
    { title: 'Description', value: 'description' },
  ];
  tableColumns: any[];

  @ViewChild('pdfTemplate', { static: false }) pdfTemplate: ElementRef;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private modalService: BsModalService,
    private _tableFacade: TableFacade,
    private _sharedState: SharedStateFacade,
    private _toastr: ToastrService,
    private _materialFacade: MasterMaterialFacade,
    private formBuilder: FormBuilder,
    private _tableSectionsService: TableSectionsService,
    public translate: TranslateService,
    private _reportFacade: ReportFacade
  ) {
    this.tableColumns = [
      // { title: 'Kapittel', value: 'Chapter' },
      { title: 'Byggdel', value: 'buildingComponents' },
      { title: 'Description', value: 'description' },
      { title: 'Quantity', value: 'quantity' },
      // { title: 'Enh. Pris', value: 'totalPrice' },
      {
        title: 'Material Sum',
        value: 'varePrisWithCapChargesWithQuantityAndPaslag',
      },
      // { title: 'Enh. tid', value: 'Enh. time' },
      { title: 'Work Sum', value: 'totalTimePrice' },
      { title: 'Total Sum', value: 'totalPrice' },
    ];
  }

  onDrop(event: CdkDragDrop<string[]>) {
    const from = this.tableData[event.previousIndex];
    const to = this.tableData[event.currentIndex];

    const payload = {
      from: {
        id: from._id,
        order: from.order,
      },
      to: to.order,
      type: from.type,
      division: from.division,
    };
    this.reorder(payload);
    // moveItemInArray(this.tableData, event.previousIndex, event.currentIndex);
  }

  ngOnInit() {
    this._route.url
      .pipe(withLatestFrom(this._route.paramMap, this._route.queryParamMap))
      .subscribe(([url, paramMap, queryParamMap]) => {
        const type: any = paramMap.get('type')
          ? paramMap.get('type')
          : 'engineering';
        const div: any = paramMap.get('division')
          ? paramMap.get('division')
          : 'all';
        this.activeItem = processMenu.find((o) => o.routerLink === type);
        const division = divisionMenu.find((o) => o.routerLink === div);
        this.activeItem.division = division.value;
        this._tableFacade.setActiveTableNameAction(this.activeItem.value);
        this.visibleRowIndex = -1;
        // this.fetchTableData();
        this.setQueryParams();
      });
    this._route.params.subscribe((param) => {
      if (param) {
        this.currentPage = 1;
      }
    });

    this._route.queryParamMap.subscribe((params) => {
      if (params && params.get('pageno')) {
        const currentPage = parseInt(params.get('pageno'))
          ? parseInt(params.get('pageno'))
          : this.currentPage;
        const sortField = params.get('sortfield');
        const sortBy = params.get('sortby');

        if (currentPage && sortField && sortBy) {
          this.currentPage = currentPage;
          this.sortMethod = sortField;
          this.sortAscending = sortBy === 'acs' ? true : false;
          this.fetchTableData();
        }
      } else {
        this.setQueryParams();
      }
    });

    this.pdfTableColumns.forEach((col) => {
      this.translate.stream(col.title).subscribe((val) => {
        col.title = val;
      });
    });
  }

  onQuantityChange(materialDetail: any, ref: any, value: any) {
    if (!ref.errors) {
      if (materialDetail.quantity !== +value) {
        const payload = {
          _id: materialDetail._id,
          quantity: +value,
        };

        this.editMaterialData(payload);
      }
    }
  }

  editMaterialData(payload: any) {
    this._materialFacade.editMaterialData(payload).subscribe(
      (res) => {
        this._toastr.success('Section Updated Successfully', 'Success');
        this.closeModal();
      },
      (err) => {
        this._toastr.error(
          err.error.message || 'Something went wring!',
          'Error'
        );
        this.closeModal();
      }
    );
  }

  fnCreateUpdateMaterialForm() {
    this.updateMaterialForm = this.formBuilder.group({
      buildingComponents: [
        this.updateMaterialData.buildingComponents,
        Validators.required,
      ],
      description: [this.updateMaterialData.description],
      quantity: [
        this.updateMaterialData.quantity,
        [Validators.required, Validators.min(0)],
      ],
      division: [
        this.updateMaterialData.division
          ? this.updateMaterialData.division
          : 'All',
      ],
    });
  }

  get UpdateMaterialFormControls(): any {
    return this.updateMaterialForm.controls;
  }

  fnGetIsLoading() {
    this.isLoading$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((val) => {
      this.isLoading = val;
    });
  }

  fetchTableData() {
    this._tableFacade.setTableFetchOption({
      limit: this.limit,
      order: this.sortAscending ? 'acs' : 'des',
      page: this.currentPage,
      sort: this.sortMethod,
      type: this.activeItem.value,
      division: this.activeItem.division,
    });
    this._tableFacade.fetchTableData();
    this.tableData$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: any) => {
        if (res) {
          this.tableData = res.data;
          this.metaData = res.metadata[0];
        }
      });
  }

  openDeleteModal(modal: any, payload: any, isDeletingSubMaterial: boolean) {
    this.isDeletingSubMaterial = isDeletingSubMaterial;
    if (isDeletingSubMaterial) {
      this.deleteSubMaterialId = payload._id;
      this.deleteSubMaterialName = payload.application;
    } else {
      this.deleteMaterialId = payload._id;
      this.deleteMaterialName = payload.buildingComponents;
    }
    const config: ModalOptions = {
      class: 'cm-modal',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(modal, config);
  }

  openDuplicateModal(modal: any, payload: any, isDeletingSubMaterial: boolean) {
    this.duplicateDivision = payload.division;
    this.duplicateObj = {
      subMaterials: payload.subMaterials.map((o) => o._id),
      quantity: 0,
      index: payload.index,
      type: payload.type,
      order: payload.order,
      buildingComponents: payload.buildingComponents,
      description: payload.description,
    };
    const config: ModalOptions = {
      class: 'cm-modal',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(modal, config);
  }

  reorder(payload) {
    this._tableFacade
      .reorderAction(payload)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: any) => {
        // console.log(res);
      });
  }

  openUpdateModal(modal: any, payload: any) {
    this.updateMaterialData = payload;
    this.fnCreateUpdateMaterialForm();
    const config: ModalOptions = {
      class: 'cm-modal',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(modal, config);
  }

  deleteMaterial() {
    if (this.isDeletingSubMaterial) {
      this._tableFacade
        .deleteSubMaterialDataAction(this.deleteSubMaterialId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (res) => {
            this._toastr.success('Section Deleted', 'Success');
            this.closeModal();
          },
          (err) => {
            this._toastr.warning('Something went wrong!', 'Error');
          }
        );
    } else {
      this._tableFacade
        .deleteMaterialDataAction(this.deleteMaterialId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (res) => {
            this._toastr.success('Section Deleted', 'Success');
            this.closeModal();
          },
          (err) => {
            this._toastr.warning('Something went wrong!', 'Error');
          }
        );
    }
  }

  duplicateMaterail() {
    this.duplicateObj.division = this.duplicateDivision;
    this.duplicateObj.isDuplicate = true;
    this._materialFacade.addMaterialData(this.duplicateObj).subscribe(
      (res) => {
        this.duplicateObj = null;
        this._toastr.success('Section Duplicated', 'Success');
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

  updateMaterial() {
    const payload = {
      ...this.updateMaterialForm.value,
      index: this.activeItem.index,
      _id: this.updateMaterialData._id,
    };

    if (this.updateMaterialData.buildingComponents) {
      payload.division = payload.division === 'All' ? '' : payload.division;
      this.editMaterialData(payload);
    }
  }

  toggleSubMaterial(row, i) {
    this.visibleRowIndex = i;
    // if (row.subMaterials[0]) {
    //   this.subMaterialColumns = Object.keys(row.subMaterials[0]).filter(items => !this.removeCol.includes(items));
    // }
  }

  setQueryParams() {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        limit: this.limit,
        pageno: this.currentPage,
        sortfield: this.sortMethod,
        sortby: this.sortAscending ? 'acs' : 'des',
      },
      queryParamsHandling: 'merge',
    });
  }

  sort(item, i) {
    if (i === this.sortedColumnsIndex) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = true;
    }
    this.sortedColumnsIndex = i;
    this.sortMethod = item;
    this.currentPage = 1;
    this.setQueryParams();
  }

  pageChange(e) {
    this.currentPage = e.page;
    this.setQueryParams();
  }

  limitChange(e) {
    this.limit = e.target.value;
    this.setQueryParams();
  }

  openSubMaterialDetails(details: any) {
    const initialState = {
      subMaterialDetails: details,
      materialName: this.activeItem.value,
      isEditSubMaterial: true,
    };

    this._sharedState.addSubMaterialDetail(details);

    const config: any = {
      class: 'cm-modal-x1',
      ignoreBackdropClick: true,
      initialState: initialState,
    };
    this.bsModalRef = this.modalService.show(
      SubMaterialDetailsComponent,
      config
    );
  }

  openMaterialForm() {
    const initialState = {
      subMaterialDetails: '',
      isEditMode: false,
      activeTableName: this.activeItem,
    };

    const config: any = {
      class: 'cm-modal',
      ignoreBackdropClick: true,
      initialState: initialState,
    };
    this.bsModalRef = this.modalService.show(MaterialComponent, config);
  }

  openMaterialEditForm(row) {
    const initialState = {
      subMaterialDetails: row,
      isEditMode: true,
      activeTableName: this.activeItem,
    };

    const config: any = {
      class: 'cm-modal',
      ignoreBackdropClick: true,
      initialState: initialState,
    };
    this.bsModalRef = this.modalService.show(MaterialComponent, config);
  }

  closeModal() {
    this.modalService.hide();
  }

  async getPDFData() {
    const data: any = await this._tableSectionsService.getTableSectionsData();
    const sectionData = data.data;

    const cols = this.pdfTableColumns.map((d: any) => d.title);
    const doc = new jsPDF();
    const rows = [];

    sectionData.forEach((section: any) => {
      const arr = [];
      this.pdfTableColumns.forEach((tableCol: any) => {
        arr.push(section[tableCol.value]);
      });
      rows.push(arr);
    });

    doc.autoTable(cols, rows, {
      didParseCell: function (table, data) {
        if (table.section === 'head') {
          table.cell.styles.fillColor = '#344154';
          table.cell.styles.textColor = '#fff';
        }
      },
    });

    doc.save('sectionData.pdf');
  }

  async clearAllQty() {
    // const data: any = await this._tableSectionsService.getTableSectionsData();
    this._tableFacade.clearAllQtyAction();
  }

  async getOffer(type, options) {
    // const data: any = await this._tableSectionsService.getReportData(type);
    // this.exportToPDF(data, type);
    // debugger;
    const initialState = {
      offerType: this.activeItem.name,
      isForCustomer: options.isForCustomer,
    };

    const config: any = {
      class: 'cm-modal',
      ignoreBackdropClick: true,
      initialState: initialState,
    };
    this.bsModalRef = this.modalService.show(ClientFormComponent, config);
  }

  async getOfferOld(type) {
    const data: any = await this._tableSectionsService.getReportData(type);
    this.exportToPDF(data, type);
  }

  exportToPDF(reportData, type) {
    const doc = new jsPDF();
    let rows = [];

    const tableColumns = [
      // { title: 'Kapittel', value: 'Chapter' },
      { title: 'Building Components', value: 'buildingComponents' },
      { title: 'Description', value: 'description' },
      { title: 'Quantity', value: 'quantity' },
      // { title: 'Enh. Pris', value: 'totalPrice' },
      {
        title: 'Material Sum',
        value: 'varePrisWithCapChargesWithQuantityAndPaslag',
      },
      // { title: 'Enh. tid', value: 'Enh. time' },
      { title: 'Work Sum', value: 'totalTimePrice' },
      { title: 'Total Sum', value: 'totalPrice' },
    ];

    let group = reportData.data.reduce((r, a) => {
      r[a.type] = [...(r[a.type] || []), a];
      return r;
    }, {});
    const keysArr = Object.keys(group);

    keysArr.forEach((key) => {
      const headerColumns = [{ title: key, value: '' }];

      headerColumns.forEach((col) => {
        this.translate.stream(col.title).subscribe((val) => {
          col.title = val;
        });
      });

      doc.autoTable(headerColumns, '', {
        didParseCell: function (table, data) {
          if (table.section === 'head') {
            table.cell.styles.fillColor = '#fff';
            table.cell.styles.textColor = '#000';
            table.cell.styles.halign = 'center';
            table.cell.styles.fontSize = 14;
          }
        },
      });

      group[key].forEach((data: any) => {
        const arr = [];
        tableColumns.forEach((col: any) => {
          arr.push(data[col.value]);
        });
        rows.push(arr);
      });

      tableColumns.forEach((col) => {
        if (col.title) {
          this.translate.stream(col.title).subscribe((val) => {
            col.title = val;
          });
        }
      });

      doc.autoTable(tableColumns, rows, {
        didParseCell: function (table, data) {
          if (table.section === 'head') {
            table.cell.styles.fillColor = '#344154';
            table.cell.styles.textColor = '#fff';
          }
        },
      });
      rows = [];
      // doc.addPage();
    });

    // reportData.data.forEach((data: any) => {
    //   const arr = [];
    //   this.tableColumns.forEach((col: any) => {
    //     arr.push(data[col.value]);
    //   });
    //   rows.push(arr);
    // });

    // doc.autoTable(this.tableColumns, rows, {
    //   didParseCell: function (table, data) {
    //     if (table.section === 'head') {
    //       table.cell.styles.fillColor = '#344154';
    //       table.cell.styles.textColor = '#fff';
    //     }
    //   },
    // });

    // const totalColumns = [
    //   { title: 'Delsum', value: 'Subtotal' },
    //   { title: 'Tilleggsmateriale', value: 'Surcharge Material' },
    //   { title: 'Tilleggsarbeid', value: 'Surcharge Work' },
    //   { title: 'Total', value: 'Total' },
    // ];

    const totalColumns = [
      { title: '', value: '' },
      { title: '', value: '' },
      { title: '', value: '' },
      { title: '', value: '' },
      { title: '', value: '' },
    ];

    const totalRows = [
      ['Delsum', reportData.subtotal],
      [
        `Tilleggsmateriale (rigg od drift) (${reportData.surchargeMaterial} %)`,
        reportData.surchargeMaterialValue,
      ],
      // [
      //   `Tilleggsarbeid (rigg od drift) (${reportData.surchargeWork} %)`,
      //   reportData.surchargeWorkValue,
      // ],
      //hellousamatahir
      ['Total', reportData.total],
    ];

    doc.autoTable(totalColumns, totalRows, {
      didParseCell: function (table, data) {
        table.cell.styles.halign = 'right';
        table.cell.styles.fontStyle = 'bold';
        // if (table.row.index === 1) {
        //   table.cell.styles.fontSize = 11;
        // }
        if (table.row.index === 3) {
          table.cell.styles.fontSize = 12;
        }
      },
    });
    // doc.save(`${type}_report.pdf`);
    doc.save(`tilbud.pdf`);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
