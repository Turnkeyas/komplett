import { ISectionModel } from "./../materials/material.model";
import { getTotal, percentageToAmount, round } from "./utils";
import { Response, NextFunction } from "express";
import { logger } from "../../config/winston";
import { SectionModel } from "../materials/material.model";
import {
  OfferTemplateModel,
  IOfferTemplateModel,
} from "../offer-template/offer-template.model";
import CompanySettingsModel, {
  ICompanySettingsModel,
} from "../company-settings/company-settings.model";

const match = {
  $match: {
    quantity: {
      $gte: 1,
    },
  },
};
const lookup = {
  $lookup: {
    from: "SubMaterials",
    localField: "subMaterials",
    foreignField: "_id",
    as: "subMaterials",
  },
};

const unwindSubMaterials = {
  $unwind: {
    path: "$subMaterials",
    preserveNullAndEmptyArrays: true,
  },
};

const lookupFag = {
  $lookup: {
    from: "Fags",
    localField: "subMaterials.subject",
    foreignField: "_id",
    as: "subMaterials.subjectDoc",
  },
};

const unwindSubject = {
  $unwind: {
    path: "$subMaterials.subjectDoc",
    preserveNullAndEmptyArrays: true,
  },
};

const lookupGroup = {
  $lookup: {
    from: "MaterialGroups",
    localField: "subMaterials.groupId",
    foreignField: "_id",
    as: "subMaterials.group",
  },
};

const unwindGroup = {
  $unwind: {
    path: "$subMaterials.group",
    preserveNullAndEmptyArrays: true,
  },
};

// FIXME - add $first here whenever change model
const group = {
  $group: {
    _id: "$_id",
    quantity: { $first: "$quantity" },
    unit: { $first: "$unit" },
    buildingComponents: { $first: "$buildingComponents" },
    code: { $first: "$code" },
    // level: { $first: "$level" },
    type: { $first: "$type" },
    description: { $first: "$description" },
    subMaterials: { $push: "$subMaterials" },
    index: { $first: "$index" },
    division: { $first: "$division" },
    order: { $first: "$order" },
  },
};

export async function fetchReportData(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    let aggregation = [];

    aggregation.push(
      match,
      lookup,
      unwindSubMaterials,
      lookupFag,
      unwindSubject,
      lookupGroup,
      unwindGroup,
      group
    );

    if (req.query.type) {
      const matchType = {
        $match: {
          type: req.query.type,
        },
      };

      aggregation.push(matchType);
    }

    const sortAggregate = { $sort: { index: 1, order: 1 } };
    aggregation.push(sortAggregate);

    const sectionList = await SectionModel.aggregate(aggregation);

    // We have 1 item in the list
    const companySettingList: any = await CompanySettingsModel.find({});
    const firstCompanySetting: ICompanySettingsModel = companySettingList[0];

    const sectionWithTotalPriceList = [];
    let subtotal = 0;
    for (let index: number = 0; index < sectionList.length; index++) {
      const section: ISectionModel = sectionList[index];
      const surcharge: IOfferTemplateModel = await OfferTemplateModel.findOne({
        value: section.type,
      });
      let totalPriceSection: number = 0;

      const subMaterials = section.subMaterials.map((material: any) => {
        const totalPrice: number = getTotal(
          material,
          section.quantity,
          surcharge,
          firstCompanySetting
        );
        totalPriceSection += totalPrice;
        return {
          ...material,
          totalPrice,
        };
      });

      subtotal += totalPriceSection;
      sectionWithTotalPriceList.push({
        ...section,
        totalPrice: totalPriceSection,
        subMaterials,
      });
    }

    const surchargeMaterialValue = percentageToAmount(
      subtotal,
      firstCompanySetting.surchargeMaterial
    );
    const surchargeWorkValue = percentageToAmount(
      subtotal,
      firstCompanySetting.surchargeWork
    );

    const total: number =
      subtotal + surchargeMaterialValue + surchargeWorkValue;
    const totalTax: number = percentageToAmount(
      total,
      firstCompanySetting.valueAddedTax
    );
    const totalWithTax: number = totalTax + total;

    const reportData = {
      subtotal,
      surchargeMaterialValue,
      surchargeMaterial: firstCompanySetting.surchargeMaterial,
      surchargeWorkValue,
      surchargeWork: firstCompanySetting.surchargeWork,
      total,
      data: sectionWithTotalPriceList,
      totalTax,
      totalWithTax,
    };

    res.json(reportData);
  } catch (error) {
    logger.error("error", error, {
      file: "fag -> report.controller.ts -> fetchReportData",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}
