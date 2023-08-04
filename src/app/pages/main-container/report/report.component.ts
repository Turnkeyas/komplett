import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportFacade } from 'src/app/states/report/report.facade';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = this._reportFacade.isLoading$;
  reportData$: Observable<any> = this._reportFacade.getReportdata$;
  private ngUnsubscribe = new Subject();
  reportData: any;
  firstTableColumns: any[];
  tableColumns: any[];
  isLoading: Boolean = false;

  constructor(private _reportFacade: ReportFacade) {
    this.firstTableColumns = [
      { title: 'Materialer', value: 'Materials' },
      { title: 'Arbeid', value: 'Work' },
      { title: 'Sum', value: 'Sum' },
      { title: 'Tid', value: 'Time' },
    ];

    this.tableColumns = [
      // { title: 'Kapittel', value: 'Chapter' },
      { title: 'Byggdel', value: 'buildingComponents' },
      { title: 'Mengde', value: 'quantity' },
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

  ngOnInit(): void {
    this.fnGetIsLoading();
    this.fnGetReportData();
  }

  fnGetIsLoading() {
    this.isLoading$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((val) => {
      this.isLoading = val;
    });
  }

  isNumber(val): boolean {
    return typeof val === 'number';
  }

  fnGetReportData() {
    this._reportFacade.fetchReportData();
    this.reportData$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((val) => {
      this.reportData = val;
    });
  }

  exportToPDF() {
    const data: any = this.reportData;

    const doc = new jsPDF();
    const rows = [];

    this.reportData.data.forEach((data: any) => {
      const arr = [];
      this.tableColumns.forEach((col: any) => {
        arr.push(data[col.value]);
      });
      rows.push(arr);
    });

    doc.autoTable(this.tableColumns, rows, {
      didParseCell: function (table, data) {
        if (table.section === 'head') {
          table.cell.styles.fillColor = '#344154';
          table.cell.styles.textColor = '#fff';
        }
      },
    });

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
    ];

    const totalRows = [
      ['Delsum', this.reportData.subtotal],
      [
        `Tilleggsmateriale (${this.reportData.surchargeMaterial} %)`,
        this.reportData.surchargeMaterialValue,
      ],
      [
        `Tilleggsarbeid (${this.reportData.surchargeWork} %)`,
        this.reportData.surchargeWorkValue,
      ],
      ['Total', this.reportData.total],
    ];

    doc.autoTable(totalColumns, totalRows, {
      didParseCell: function (table, data) {
        table.cell.styles.halign = 'right';
        table.cell.styles.fontStyle = 'bold';
        if (table.row.index === 3) {
          table.cell.styles.fontSize = 12;
        }
      },
    });

    doc.save('report.pdf');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
