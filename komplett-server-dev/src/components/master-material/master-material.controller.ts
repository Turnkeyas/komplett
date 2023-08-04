import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import { HttpError } from "../../config/error";
import { logger } from "../../config/winston";
import { MaterialModel, tabTypes } from "../materials/material.model";
import MasterMaterialDAO from "./master-material.dao";
import MasterMaterialValidation from "./master-material.validation";
import * as Joi from "joi";
import { paginationConfig } from "../dao";
import FagModel from "../fag/fag.model";
import { MasterMaterialModel } from "./master-material.model";

// DONE
export async function findByCategory(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const category = req.query.category || "all";
    const groupId = req.query.groupId || "all";

    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const order = req.query.order;
    const sort = req.query.sort;

    const config: any = {
      limit,
      page,
      sort,
      order,
      category,
      groupId,
    };

    const masterMaterials = await MasterMaterialDAO.findMasterMaterialByCategory(
      config
    );
    res.json(masterMaterials);
  } catch (error) {
    logger.error("error", error, {
      file: "master-material -> master-material.controller.ts -> findAll",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}

// DONE
export async function insertInMasterMaterial(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;
    if (!body.category || !(body.category in tabTypes)) {
      throw new Error("category field is not Correct !!");
    }
    if (!body.application) {
      throw new Error("application is not present in request body");
    }

    // check if subject id is valid

    // if (body.subject) {
    //     const fagDoc = await FagModel.findById(body.subject);
    //     if (!fagDoc) {
    //         throw new Error("Fag(subject) with id does not exits");
    //     }
    // }
    const doc = await MasterMaterialDAO.insertInMasterMaterial(body);
    res.json(doc);
  } catch (error) {
    logger.error("error", error, {
      file:
        "master-material -> master-material.controller.ts -> insertInMasterMaterial",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}

export async function deleteMasterMaterial(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const validate: Joi.ValidationResult<any> = MasterMaterialValidation.checkIdValidation(
      { id: id }
    );
    if (validate.error) {
      throw new Error(validate.error.message);
    }
    const doc = await MasterMaterialDAO.deleteRecord(id);
    res.json(doc);
  } catch (error) {
    logger.error("error", error, {
      file:
        "master-material -> master-material.controller.ts -> deleteMasterMaterial",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}

// DONE
export async function updateMasterMaterial(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;
    const id = body._id;
    const validate: Joi.ValidationResult<any> = MasterMaterialValidation.checkIdValidation(
      { id: id }
    );
    if (validate.error) {
      throw new Error(validate.error.message);
    }
    if (body.category && !(body.category in tabTypes)) {
      throw new Error("Category is not valid..");
    }

    // check if subject id is valid
    // if (body.subject) {
    //     const fagDoc = await FagModel.findById(body.subject);
    //     if (!fagDoc) {
    //         throw new Error("Fag(subject) with id does not exits");
    //     }
    // }
    const doc = await MasterMaterialDAO.update(id, req.body);

    // update submaterial
    const updatedDoc = await MasterMaterialModel.findById(id).lean();
    delete updatedDoc["_id"];
    await MaterialModel.update({ masterMaterialId: id }, updatedDoc);
    res.json(doc);
  } catch (error) {
    logger.error("error", error, {
      file:
        "master-material -> master-material.controller.ts -> updateMasterMaterial",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}

export async function uploadDocument(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    var fullUrl = req.protocol + "://" + req.get("host");
    const data = req.body;
    if (req.file && req.file.path) {
      const imageUrl = req.file.path;
      if (imageUrl) {
        data["url"] = fullUrl + "/" + imageUrl;
        if (data._id) {
          // const doc = {
          //     _id: data._id,
          //     documents: [
          //         {
          //             url: fullUrl + '/' + imageUrl
          //         }
          //     ]
          // }
          const doc = {
            _id: data._id,
            fdvDocument: fullUrl + "/" + imageUrl,
          };
          await MasterMaterialModel.findByIdAndUpdate(doc._id, doc);
        }
      }
    }
    const result = await MasterMaterialModel.findById(data._id);

    res.json(result);
  } catch (error) {
    logger.error("error", error, {
      file: "masterMaterial -> masterMaterial.controller.ts -> uploadDocument",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    next(new HttpError(error.message.status, error.message));
  }
}

export async function deleteDocument(
  req: any,
  res: Response,
  next: NextFunction
) {
  //TODO :  delete file from folder
  try {
    const id = req.params.id;
    await MasterMaterialModel.findByIdAndUpdate(id, {
      fdvDocument: "",
    });
    const result = await MasterMaterialModel.findById(id);

    res.json(result);
  } catch (error) {
    logger.error("error", error, {
      file: "masterMaterial -> masterMaterial.controller.ts -> deleteDocument",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    next(new HttpError(error.message.status, error.message));
  }
}
