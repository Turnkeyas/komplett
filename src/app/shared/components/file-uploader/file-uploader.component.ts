import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TableFacade } from 'src/app/states';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit, OnDestroy {
  getIsDocumentUploading: Observable<boolean> = this._tableFacade.getIsDocumentUploading$;
  private ngUnsubscribe = new Subject();

  @Output() onUpload = new EventEmitter<any>();

  isDocumentUploading: boolean;
  fileName: any;
  file: any;

  constructor(private _tableFacade: TableFacade) { }

  ngOnInit() {
    this.fnGetIsDocumentUploading();
  }

  fnGetIsDocumentUploading() {
    this.getIsDocumentUploading.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((val) => {
        this.isDocumentUploading = val;
      });
  }

  fileChange(input) {
    if (input.files.length) {
      this.fileName = input.files[0].name;
      this.file = input.files[0];
    }
  }

  onUploadFile() {
    if (this.file) {
      this.onUpload.emit(this.file);
    }
  }

  removeFile(): void {
    this.fileName = '';
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
