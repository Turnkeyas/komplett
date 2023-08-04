import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TableSectionsService } from 'src/app/shared/components/table/table-sections.service';
import { TranslateService } from '@ngx-translate/core';
import { emailId } from 'src/app/providers/custom-validators';
import { MakePDFService } from '../../services/make-pdf/make-pdf.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
})
export class ClientFormComponent implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;

  clientForm: FormGroup;
  offerType: any;
  companyLogo: any;
  companyRightSideLogo: any;
  clientDetail: any;
  reportData: any;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    public translateService: TranslateService,
    private _tableSectionsService: TableSectionsService,
    public translate: TranslateService,
    public makePDFService: MakePDFService
  ) {}

  ngOnInit(): void {
    this.createClientForm();
  }

  createClientForm() {
    this.clientForm = this.formBuilder.group({
      // offer: ['', [Validators.required]],
      customerName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNo: ['', [Validators.required]],
      email: ['', [Validators.required, emailId]],
    });
  }

  get controls() {
    return this.clientForm.controls;
  }

  calculateVegg(objectArray: any[]): number {
    const veggPriority = [
      'Underlag for flis vegg',
      'Våtromsplater vegg- Litex membranplater ',
      'Våtromsplater vegg- Smøremembran',
    ];

    for (let i = 0; i < veggPriority.length; i++) {
      const vegg = objectArray.find(
        (item) => item.buildingComponents === veggPriority[i]
      );

      if (vegg) {
        return vegg.quantity;
      }
    }
    return 0;
  }

  groupBy(objectArray: any, property: any) {
    return objectArray.reduce((acc: any, obj: any) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
        acc['key'] = key;
      }

      // Add object to list for given key's value
      acc[`${key}_vegg`] = this.calculateVegg(objectArray);
      const gulv = objectArray.find((o) => {
        return (
          o.buildingComponents.toLowerCase().includes('gulv') ||
          o.buildingComponents.toLowerCase().includes('riving av')
        );
      });
      acc[`${key}_gulv`] = gulv ? gulv.quantity : 0;
      const tak = objectArray.find((o) => {
        return (
          o.buildingComponents.toLowerCase().includes('ny himling') ||
          o.buildingComponents.toLowerCase().includes('sparkling') ||
          o.buildingComponents.toLowerCase().includes('maling')
        );
      });
      acc[`${key}_tak`] = tak ? tak.quantity : 0;

      acc[`${key}_desc`] = ``;
      acc[
        `${key}_desc`
      ] += `Total renovering av ${this.translateService
        .instant(key)
        .toLowerCase()} `;
      if (acc[`${key}_vegg`] && acc[`${key}_gulv`] && acc[`${key}_tak`]) {
        acc[`${key}_desc`] += `${acc[`${key}_gulv`]} kvm, vegg ${
          acc[`${key}_vegg`]
        } kvm og tak ${acc[`${key}_tak`]} kvm:\n`;
      } else if (acc[`${key}_vegg`] && acc[`${key}_gulv`]) {
        acc[`${key}_desc`] += `${acc[`${key}_gulv`]} kvm og vegg ${
          acc[`${key}_vegg`]
        } kvm:\n`;
      } else if (acc[`${key}_vegg`] && acc[`${key}_tak`]) {
        acc[`${key}_desc`] += `vegg ${acc[`${key}_vegg`]} kvm og tak ${
          acc[`${key}_tak`]
        } kvm:\n`;
      } else if (acc[`${key}_gulv`] && acc[`${key}_tak`]) {
        acc[`${key}_desc`] += `${acc[`${key}_gulv`]} kvm og tak ${
          acc[`${key}_tak`]
        } kvm:\n`;
      } else if (acc[`${key}_vegg`]) {
        acc[`${key}_desc`] += `vegg ${acc[`${key}_vegg`]} kvm:\n`;
      } else if (acc[`${key}_gulv`]) {
        acc[`${key}_desc`] += `${acc[`${key}_gulv`]} kvm:\n`;
      } else if (acc[`${key}_tak`]) {
        acc[`${key}_desc`] += `tak ${acc[`${key}_tak`]} kvm:\n`;
      }
      acc[`${key}_desc`] += `Det er et ${this.translateService.instant(
        key
      )} som ønskes å total renoveres, rives ned til stender verk for så å gjenoppbygges. `;
      acc[`${key}_desc`] += `${this.translateService.instant(
        key
      )} skal bestå av innebygget cisterne, dusjhjørne, badekar og dobbel servant med speilskap. `;
      acc[
        `${key}_desc`
      ] += ` Det skal legges nye varmekabler, spotter i tak, stikk kontakter og kobling av strøm til speil skap.`;
      acc[key].push(obj);
      return acc;
    }, {});
  }

  async generateOfferPdf() {
    this.isLoading = true;
    this.reportData = await this._tableSectionsService.getReportData();
    this.clientDetail = this.clientForm.value;
    await this.generatePDF();
    const basePrintData = {
      company1: {
        company_name: 'Baderom Pluss',
        Address: 'Leiv Eirikssons gate 1 a, 0271 Oslo',
        Tel: '+47 983 680 00',
        Email: 'post@baderom.no',
        Org_nr: '919 833 300',
        logo_url: this.companyLogo,
        logo_type: 'jpeg',
      },
      company2: {
        customer_name: this.clientDetail.customerName,
        Address: this.clientDetail.address,
        Tel: this.clientDetail.phoneNo,
        Email: this.clientDetail.email,
        logo_url: this.companyRightSideLogo,
        logo_type: 'png',
      },
    };
    const data: any = Object.assign(basePrintData, this.reportData);
    data.base_info = this.groupBy(data.data, 'division');
    data.base_info.text = `  `;
    // data.base_info.text = `Etter befaring hos Dere har vi gleden av å informere om vårt tilbud.`;
    data.repayment_agreement = ``;
    // data.repayment_agreement += `:\n`;
    data.repayment_agreement += `1) 30% Betales ved oppstart av jobb. Starter med Prosjektering, tildekkning og rivearbeid. Vi kjøper inn varer og starte med rørlegger arbeid, elektrisk arbeid og tømrer arbeid.\n`;
    data.repayment_agreement += `2) 30% Veggene er rettet og grunntegning er etablert. Da trukket alle elektriske kabler samt varmekabler. Alle røropplegg er satt på riktig plass og sluk er etablert.\n`;
    data.repayment_agreement += `3) 30 % betales etter at betong er lagt og veggene er lukket igjen med osb plater og våtromsplater plater. Det settes da membran på vegger og gulv. Badet skal være klart for legging av flis eller annen overflate til gulv og vegger, med derpå følgende montering av innredning\n`;
    data.repayment_agreement += `4) 10 % av det avtalte vederlag ved ferdigstillelse, badet blir godkjent av kunde og prosjektleder.\n\n`;
    data.repayment_agreement += `Når de siste 10% er innbetalt vil dokumentasjon bli sendt til bolig mappe.\n`;
    data.repayment_agreement += `Med vennlig hilsen Brødrene Skog AS, Ved Jakob Issa. Org. Nummer: 916339097, Tlf: 90997090\n\n`;
    data.repayment_agreement += `Garanti:\n`;
    data.repayment_agreement += `20 års garanti på varmekabler.\n`;
    data.repayment_agreement += `20 års garanti på rør-i-rørsystem fra Sanipex.\n`;
    data.repayment_agreement += `10 års garanti på membran arbeid.\n`;
    data.repayment_agreement += `6 års garanti på resterende arbeid.\n`;
    data.repayment_agreement += `Vi er våtromssertifisert bedrift.\n`;

    data.pdfList = this.getMaterialPdfList(data.data);
    await this.makePDFService.makePDF(data, {
      isForCustomer: this.bsModalRef.content.isForCustomer
    });
    this.isLoading = false;
    this.closeModal();
  }

  getMaterialPdfList(data: any[]): string[] {
    try {
      return data.reduce((acc: string[], current) => {
        const pdfLinks = current.subMaterials
          .filter((item) => item.fdvDocument)
          .map((item) => item.fdvDocument);

        return acc.concat(pdfLinks);
      }, []);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async generatePDF() {
    await this.getBase64ImageFromUrl(
      '../../../assets/img/logo/company-logo.jpeg'
    ).then((result) => {
      this.companyLogo = result;
    });

    await this.getBase64ImageFromUrl(
      '../../../assets/img/logo/company-badges.png'
    ).then((result) => {
      this.companyRightSideLogo = result;
    });
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    var imageUrl;

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener(
        'load',
        function () {
          imageUrl = reader.result;
          resolve(reader.result);
        },
        false
      );

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
      return imageUrl;
    });
  }
}
