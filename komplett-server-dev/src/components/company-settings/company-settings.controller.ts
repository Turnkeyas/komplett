import { Request, Response, NextFunction } from "express";
import { logger } from "../../config/winston";
import customerDao from "../customer/customer.dao";
import companySettingsService from "./company-settings.service";
import companySettingsValidation from "./company-settings.validation";
import * as Joi from "joi";
import { identity } from "lodash";
import FagModel from "../fag/fag.model";

export async function findCompanySettings(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const doc = await companySettingsService.findCompanySettings(user.id);
    res.json(doc);
  } catch (error) {
    logger.error("error", error, {
      file:
        "company-settings -> company-settings.controller.ts -> findCompanySettings",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}

export async function insertCompanySetting(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;
    const user = req.user;
    body["userId"] = user.id;
    const doc = await companySettingsService.insertCompanySettings(body);
    res.json(doc);
  } catch (error) {
    logger.error("error", error, {
      file:
        "company-settings -> company-settings.controller.ts -> insertCompanySetting",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}

export async function deleteCompanySetting(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    console.log(id);
    const validate: Joi.ValidationResult<any> = companySettingsValidation.checkIdValidation(
      { id: id }
    );
    if (validate.error) {
      throw new Error(validate.error.message);
    }
    const doc = await companySettingsService.deleteCompanySettings(id);
    res.json(doc);
  } catch (error) {
    logger.error("error", error, {
      file:
        "company-settings -> company-settings.controller.ts -> deleteCompanySetting",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}

export async function updateCompanySetting(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;
    const validate: Joi.ValidationResult<any> = companySettingsValidation.checkIdValidation(
      { id: body._id }
    );
    if (validate.error) {
      throw new Error(validate.error.message);
    }
    const doc = await companySettingsService.updateCompanySettings(body);
    if (doc) {
      await FagModel.updateMany(
        { isDefault: true },
        { $set: { hourlyRate: body.netSalary } }
      );
    }

    res.json(doc);
  } catch (error) {
    logger.error("error", error, {
      file:
        "company-settings -> company-settings.controller.ts -> updateCompanySetting",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}
