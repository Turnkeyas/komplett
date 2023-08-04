import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input('limitPerPage') public limitPerPage;
  @Input('total') public total;
  @Input('numberOfColumns') public numberOfColumns = 3;
  @Input('currentPage') public currentPage = 1;
  @Output() changePage = new EventEmitter();
  numberOfPaginators;
  pagesArray = [];
  visiblePagesArray = [];
  constructor() { }

  getMin(first, sec) {
    return Math.min(first, sec);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.paginator();
  }

  paginator() {
    this.pagesArray = [];
    this.numberOfPaginators = Math.ceil(this.total / this.limitPerPage);
    for (let val = 1; val <= this.numberOfPaginators; val++) {
      this.pagesArray.push(val);
    }
    this.getCurrentRow(this.currentPage);
  }

  ngOnInit(): void {
    this.paginator();
    this.visiblePagesArray = this.pagesArray.slice(this.currentPage - 1, (this.currentPage - 1) + this.numberOfColumns);
  }


  getCurrentRow(item) {
    this.currentPage = item;
    this.visiblePagesArray = this.pagesArray.slice(0, this.numberOfColumns);
    if (item && item >= this.numberOfColumns) {
      if (this.numberOfPaginators >= this.numberOfColumns + item) {
        let ope = Math.floor(this.numberOfColumns / 2);
        this.visiblePagesArray = this.pagesArray.slice(item - 1 - ope, item + this.numberOfColumns - 1 - ope);

      }
      else {
        this.visiblePagesArray = this.pagesArray.slice(this.numberOfPaginators - this.numberOfColumns, this.numberOfPaginators)
      }
    }
    this.changePage.emit(this.currentPage);
  }
}
