import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf-yworks';
import { PDFDocument } from 'pdf-lib';

import { JspdfFontService } from './jspdf-font.service';

@Injectable({
  providedIn: 'root',
})
export class MakePDFService {
  private static START_X: any = 25;
  private static FOOTER_HEIGHT: any = 50;

  private static FS: any = {
    h1: 32,
    h2: 24,
    h3: 18.72,
    h4: 16,
    h5: 13.28,
    h6: 12,
  };

  private startY: any = 0;
  private doc: any;
  private page_height: any = 0;
  private page_width: any = 0;
  private page_center_x: any = 0;

  constructor(
    private fontService: JspdfFontService,
    public translateService: TranslateService
  ) {}

  private addNewPage(doc: any, startY: any, neededHeight: any, params: any) {
    if (params.pageEndY - startY - neededHeight < 0) {
      doc.addPage();
      return params.pageStartY;
    }
    return startY;
  }

  private addParagraph(
    doc: any,
    text: any,
    startY: any,
    fontSizes: any,
    params: any
  ) {
    const startX = params.startX;
    doc.setFontSize(fontSizes.h6);
    startY += params.lineSpacing * 1.5;
    doc.setFontType('normal');

    let splitText = doc.splitTextToSize(
      text,
      params.endX - params.startX // doc.internal.pageSize.width - (startX * 2)
    );

    // const pageHeight = doc.internal.pageSize.height;
    // const endY = pageHeight - 50; // minus footerHeight
    const neededSpacing = params.lineSpacing * 4;
    let neededHeight = splitText.length * doc.internal.getLineHeight();
    let spaceForLines = Math.floor(
      (params.pageEndY - startY) / doc.internal.getLineHeight()
    );

    // check if new page is needed right at beginning
    startY = this.addNewPage(doc, startY, neededSpacing, params);

    let textStart;

    while (
      params.pageEndY - startY - neededHeight < 0 &&
      splitText.length > spaceForLines
    ) {
      spaceForLines = Math.floor(
        (params.pageEndY - startY) / doc.internal.getLineHeight()
      );
      neededHeight = splitText.length * doc.internal.getLineHeight();

      textStart = splitText.slice(0, spaceForLines);
      doc.setFont('WorkSans'); // set font here again, else weirdo things are printed out
      doc.text(textStart, startX, startY);
      splitText = splitText.slice(spaceForLines);

      startY = this.addNewPage(doc, startY, neededHeight, params);
    }

    // set font here again, else weirdo things are printed out
    doc.setFont('WorkSans');
    doc.text(splitText, startX, startY);
    neededHeight = splitText.length * doc.internal.getLineHeight();
    startY += neededHeight + params.lineSpacing;

    return startY;
  }

  private addSections(
    doc: any,
    printData: any,
    startY: any,
    fontSizes: any,
    params: any,
    options?: any
  ) {
    const align: any = 'center';
    doc.setFontSize(fontSizes.h3);
    doc.setFontType('bold');
    startY += params.lineSpacing * 1.5;
    const neededHeight =
      (params.lineSpacing + doc.internal.getLineHeight()) * 2;
    startY = this.addNewPage(doc, startY, neededHeight, params);
    doc.text(
      printData.buildingComponents ? printData.buildingComponents : '',
      params.startX,
      startY,
      'left'
    );

    startY = this.addParagraph(
      doc,
      printData.description ? printData.description : '',
      startY,
      fontSizes,
      params
    );

    if (!options.isForCustomer) {
      const columnSize = (params.endX - params.startX) / 8;
      doc.setFontSize(fontSizes.h6);
      doc.setFontType('bold');

      // ------- Table Header ---------------------
      startY = this.addNewPage(doc, startY, neededHeight, params);

      doc.setFillColor(241, 241, 241); // to be configure
      doc.rect(
        params.startX,
        startY - params.lineSpacing,
        params.endX - params.startX,
        params.lineSpacing * 1.5,
        'F'
      );

      let xPointer = params.startX + columnSize;
      doc.text('Post', xPointer, startY, align);
      xPointer += columnSize * 2;
      doc.text('Mengde', xPointer, startY, align);
      xPointer += columnSize;
      doc.text('Enh./stk', xPointer, startY, align);
      xPointer += columnSize;
      doc.text('Enh. Pris', xPointer, startY, align);
      xPointer += columnSize;
      doc.text('Tid', xPointer, startY, align);
      xPointer += columnSize;
      doc.text('Pris', xPointer, startY, align);

      startY += params.lineSpacing * 2;

      // ------- Table Body ---------------------
      const items = printData.subMaterials ? printData.subMaterials : [];
      doc.setFontType('normal');

      items.forEach((item: any, index: any) => {
        doc.setFontType('normal');

        const splitPost = doc.splitTextToSize(
          item.application ? item.application : '',
          columnSize * 2
        );

        // startX += doc.getStringUnitWidth(invoiceNrTxt) * fontSizes.SubTitleFontSize;
        const heightTitle = splitPost.length * doc.internal.getLineHeight();

        startY = this.addNewPage(doc, startY, heightTitle, params);

        if (index) {
          doc.setDrawColor(241, 241, 241);
          doc.line(params.startX, startY, params.endX, startY);
          startY += params.lineSpacing * 1.5;
        }

        xPointer = params.startX + columnSize;
        doc.text(splitPost, xPointer, startY, align);
        xPointer += columnSize * 2;
        doc.text(
          printData.quantity ? printData.quantity.toString() : '',
          xPointer,
          startY,
          align
        );
        xPointer += columnSize;
        doc.text(item.unit ? item.unit : '', xPointer, startY, align);
        xPointer += columnSize;
        doc.text(
          item.itemPrice ? item.itemPrice.toString() : '',
          xPointer,
          startY,
          align
        );
        xPointer += columnSize;
        doc.text(
          item.time.minPerComponent ? item.time.minPerComponent.toString() : '',
          xPointer,
          startY,
          align
        );
        xPointer += columnSize;
        doc.text(
          item.totalPrice ? item.totalPrice.toFixed(2).toString() : '',
          xPointer,
          startY,
          align
        );

        startY += heightTitle - params.lineSpacing * 0.5;
      });

      doc.setDrawColor(0, 0, 0);
      doc.line(params.startX, startY, params.endX, startY);
      startY += params.lineSpacing;
      doc.setFontType('bold');
      doc.setFontSize(fontSizes.h4);
      startY += 3;
      xPointer = params.startX + columnSize * 6;
      doc.text(this.translateService.instant('Total'), xPointer, startY, align);
      xPointer += columnSize;
      doc.text(
        printData.totalPrice ? printData.totalPrice.toFixed(2).toString() : '',
        xPointer,
        startY,
        align
      );

      startY += params.lineSpacing * 1.5;
    }

    return startY;
  }

  private addCompanyInfoRow(
    doc: any,
    xPointer: any,
    yPointer: any,
    text1: any,
    text2: any,
    fontSize: any,
    align: any
  ) {
    doc.setFontSize(fontSize);
    doc.setFontType('bold');
    text1 = this.translateService.instant(text1) + ':  ';
    doc.text(text1, xPointer, yPointer, align);
    doc.setFontType('normal');
    const textSize = doc.getStringUnitWidth(text1) * fontSize;
    doc.text(text2, xPointer + textSize, yPointer, align);
    yPointer += doc.internal.getLineHeight();
    return yPointer;
  }

  private addCompanyInfo(
    doc: any,
    printData: any,
    startY: any,
    fontSizes: any,
    params: any
  ) {
    /*====================================== First ROW ======================================================*/
    let xPointer = params.pageCenterX;
    let yPointer = startY;
    const align = 'left';
    doc.setFontType('bold');
    doc.setFontSize(fontSizes.h3);
    doc.text('Baderom Pluss', xPointer, yPointer, align);
    yPointer += doc.internal.getLineHeight();
    const fontSize = fontSizes.h5;
    doc.setFontSize(fontSize);
    for (const key in printData.company1) {
      // check if the property/key is defined in the object itself, not in parent
      if (
        ['customer_name', 'company_name', 'Address', 'Email', 'Org_nr', 'Tel'].indexOf(
          key
        ) > -1 &&
        printData.company1.hasOwnProperty(key)
      ) {
        yPointer = this.addCompanyInfoRow(
          doc,
          xPointer,
          yPointer,
          key,
          printData.company1[key],
          fontSize,
          align
        );
      }
    }

    let imgHeight = yPointer - startY;
    let imgWidth = params.pageCenterX - params.startX;

    const logo1 = printData.company1.logo_url;

    doc.addImage(
      logo1,
      printData.company1.logo_type,
      0,
      0,
      imgWidth,
      imgHeight
    );
    yPointer += params.lineSpacing * 1.5;

    /*====================================== Second ROW ======================================================*/
    const heading2start = yPointer;
    xPointer = params.startX;
    doc.setFontType('bold');
    doc.setFontSize(fontSizes.h3);
    doc.text('Tillbud', xPointer, yPointer, align);
    yPointer += doc.internal.getLineHeight();
    doc.setFontSize(fontSize);

    for (const key in printData.company2) {
      // check if the property/key is defined in the object itself, not in parent
      if (
        ['customer_name', 'company_name', 'Address', 'Email', 'Tel'].indexOf(
          key
        ) > -1 &&
        printData.company2.hasOwnProperty(key)
      ) {
        yPointer = this.addCompanyInfoRow(
          doc,
          xPointer,
          yPointer,
          key,
          printData.company2[key],
          fontSize,
          align
        );
      }
    }

    imgHeight = yPointer - heading2start;
    imgWidth = params.pageCenterX - params.startX - 50;

    const logo2 = printData.company2.logo_url;
    doc.addImage(
      logo2,
      printData.company2.logo_type,
      params.pageCenterX,
      heading2start,
      imgWidth,
      imgHeight
    );
    return yPointer;
  }

  private addBaseInfo(
    doc: any,
    printData: any,
    startY: any,
    fontSizes: any,
    params: any
  ) {
    startY += params.lineSpacing;
    doc.setDrawColor(0, 0, 0);
    doc.line(params.startX, startY, params.endX, startY);
    startY += params.lineSpacing;
    startY = this.addParagraph(
      doc,
      printData.base_info.text,
      startY,
      fontSizes,
      params
    );
    startY -= params.lineSpacing;

    for (const key in printData.base_info) {
      // check if the property/key is defined in the object itself, not in parent
      if (
        <any>key.includes('_desc') &&
        printData.base_info.hasOwnProperty(key)
      ) {
        startY = this.addParagraph(
          doc,
          printData.base_info[key],
          startY,
          fontSizes,
          params
        );
        startY -= params.lineSpacing;
      }
    }
    startY -= params.lineSpacing;
    return startY;
  }

  private init(
    doc: any,
    printData: any,
    startY: any,
    fontSizes: any,
    params: any,
    options?
  ) {
    doc.setTextColor(51, 51, 51);
    startY = this.addCompanyInfo(doc, printData, startY, fontSizes, params);
    startY = this.addBaseInfo(doc, printData, startY, fontSizes, params);

    const align = 'center';
    const group = JSON.parse(JSON.stringify(printData.data)).reduce(
      (r: any, a: any) => {
        const typeOfWork = this.translateService.instant(a.type);
        r[typeOfWork] = [...(r[typeOfWork] || []), a];
        return r;
      },
      {}
    );

    const keysArr = Object.keys(group);

    startY += params.lineSpacing * 2;

    keysArr.forEach((typeOfWork) => {
      startY = this.addNewPage(doc, startY, params.pageHeight / 6, params);
      doc.setFontSize(fontSizes.h2);
      doc.setFontType('bold');
      doc.setFillColor(20, 25, 33); // need to make color configurable
      // need to make logic for line spacing
      doc.rect(
        params.startX,
        startY,
        params.endX - params.startX,
        doc.internal.getLineHeight() + params.lineSpacing * 0.5,
        'FD'
      );
      doc.setTextColor(255, 255, 255); // need to make color configurable
      startY += params.lineSpacing * 2;
      doc.text(typeOfWork, params.pageCenterX, startY, align);
      startY += params.lineSpacing;
      doc.setTextColor(51, 51, 51);
      let totalSum = 0;
      group[typeOfWork].forEach((d: any) => {
        startY = this.addSections(doc, d, startY, fontSizes, params, options);
        totalSum += d.totalPrice;
      });
      startY += params.lineSpacing;
      doc.setFontType('bold');
      doc.setFontSize(fontSizes.h3);
      const t = `${typeOfWork} ${this.translateService.instant(
        'Total'
      )}: ${totalSum.toFixed(2)}`;
      doc.text(t, params.endX, startY, 'right');
      startY += params.lineSpacing * 2;
    });

    const midPointX = params.pageCenterX - 100;
    const amountX = params.endX - 100;
    doc.setFontType('normal');
    doc.setFontSize(fontSizes.h4);
    const neededHeight =
      (params.lineSpacing + doc.internal.getLineHeight()) * 2;
    startY = this.addNewPage(doc, startY, neededHeight, params);
    const align2 = 'left';
    // doc.text('Delsum', midPointX, startY, align2);
    // doc.text(printData.subtotal.toFixed(0), amountX, startY, align2);
    startY += params.lineSpacing * 1.5;
    doc.text(
      `Materiale (rigg od drift) ${printData.surchargeMaterial.toString()} %`,
      midPointX,
      startY,
      align2
    );
    doc.text(
      printData.surchargeMaterialValue.toFixed(2),
      amountX,
      startY,
      align2
    );
    startY += params.lineSpacing * 1.5;
    // doc.text(
    //   `Arbeid (rigg od drift) ${printData.surchargeWork.toString()} %`,
    //   midPointX,
    //   startY,
    //   align2
    // );
    // doc.text(printData.surchargeWorkValue.toFixed(2), amountX, startY, align2);
    // startY += params.lineSpacing * 1.5;
    // hellousamatahir
    doc.text('Sum eks. mva.', midPointX, startY, align2);
    doc.text(printData.total.toFixed(2), amountX, startY, align2);
    startY += params.lineSpacing * 1.5;
    doc.text('Merverdiavgift', midPointX, startY, align2);
    doc.text(printData.totalTax.toFixed(2), amountX, startY, align2);
    startY += params.lineSpacing;
    doc.setFontType('bold');
    doc.setLineWidth(2.0);
    doc.line(params.startX, startY, params.endX, startY);
    startY += params.lineSpacing * 1.5;
    doc.text('Sum inkl. mva.', midPointX, startY, align2);
    doc.text(printData.totalWithTax.toFixed(2), amountX, startY, align2);

    // ------------------------- Repayment Aggrement -----------------------
    // startY += params.lineSpacing * 1.5;
    // this.addParagraph(
    //   doc,
    //   printData.repayment_agreement,
    //   startY,
    //   fontSizes,
    //   params
    // );

    return startY;
  }

  public async makePDF(data: any, options?) {
    this.doc = new jsPDF('p', 'pt');
    this.fontService.addFontWorkSans(this.doc);

    this.page_height = this.doc.internal.pageSize.height;
    this.page_width = this.doc.internal.pageSize.width;
    this.page_center_x = this.page_width / 2;

    const PARAMS: any = {
      startX: MakePDFService.START_X,
      endX: this.page_width - MakePDFService.START_X,
      pageStartY: 25,
      footerHeight: MakePDFService.FOOTER_HEIGHT,
      pageEndY: this.page_height - MakePDFService.FOOTER_HEIGHT,
      lineSpacing: 12,
      pageHeight: this.page_height,
      pageWidth: this.page_width,
      pageCenterX: this.page_center_x,
    };

    this.startY = PARAMS.pageStartY;
    this.startY = this.init(
      this.doc,
      data,
      this.startY,
      MakePDFService.FS,
      PARAMS,
      options
    );

    const arrayBufferList = [this.doc.output('arraybuffer')];

    // in case of not a customer, only for internals
    if (!options.isForCustomer) {
      for (let index = 0; index < data.pdfList.length; index++) {
        try {
          const pdfUrl = data.pdfList[index];
          const arrayBuffer = await this.getBytes(pdfUrl);
          arrayBufferList.push(arrayBuffer);
        } catch (error) {
          console.log(
            'pdf link: ',
            data.pdfList[index],
            ': has an error: ',
            error
          );
        }
      }
    }

    const mergedPdf = await this.mergePdfs(arrayBufferList);

    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(
      new Blob([mergedPdf], { type: 'application/pdf' })
    );
    link.download = 'tilbud.pdf';
    link.click();
  }

  async getBytes(url) {
    const data = await fetch(url).then((res) => res.arrayBuffer());
    return data;
  }

  async mergePdfs(pdfsToMerges: ArrayBuffer[]) {
    const mergedPdf = await PDFDocument.create();
    for (let index = 0; index < pdfsToMerges.length; index++) {
      const pdfBuffer = pdfsToMerges[index];
      try {
        const pdf = await PDFDocument.load(pdfBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        // console.log('pdf.getPageIndices():', pdf.getPageIndices())
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      } catch (error) {
        console.error('pdf error | index', error, index);
      }
    }

    const mergedPdfFile = await mergedPdf.save();

    return mergedPdfFile;
  }
}
