import { NextFunction, Request, Response } from "express";
import { HttpError } from "../../config/error";
import {
  IInsertSubMaterial,
  ISectionModel,
  IMaterialModel,
  tabTypes,
  SectionModel,
  MaterialModel,
} from "./material.model";
import MaterialService from "./material.dao";
import materialValidation from "./material.validation";
import * as Joi from "joi";
import { logger } from "../../config/winston";
import { Types } from "mongoose";
import { MasterMaterialModel } from "../master-material/master-material.model";
import FagModel from "../fag/fag.model";

export async function findAll(req: any, res: Response, next: NextFunction) {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  let order = req.query.order;
  let type: string = req.query.type;
  let sort: string = req.query.sort ? req.query.sort : "";
  let division: string = req.query.division;

  page = page ? page : 1;
  limit = limit ? limit : 500;
  order = order ? order : "asc";

  order = order === "des" ? -1 : 1;
  try {
    const doc: ISectionModel[] = await MaterialService.findAll(
      page,
      limit,
      order,
      type,
      sort,
      division
    );
    res.status(200).json(doc);
  } catch (error) {
    logger.error("error", error, {
      file: "material -> material.controller.ts -> findAll",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    next(new HttpError(error.message.status, error.message));
  }
}

export async function insert(req: any, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    let matchAggregate = [
      {
        $match: {
          type: body.type,
          buildingComponents: body.buildingComponents,
        },
      },
    ];

    const result = await SectionModel.aggregate(matchAggregate);
    if (result.length > 0) {
      throw new Error("Section with same name already exist");
    }
    const doc: ISectionModel = await MaterialService.insert(req.body);
    res.status(200).json(doc);
  } catch (error) {
    logger.error("error", error, {
      file: "material -> material.controller.ts -> insert",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}

export async function insertWithSubMaterials(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;
    const subMaterials = body.subMaterials;
    if (!subMaterials || !Array.isArray(subMaterials)) {
      throw new Error("subMaterials should be an array");
    }

    if (!body.buildingComponents) {
      throw new Error("buildingComponents not available in request body");
    }

    if (!body.type || !(body.type in tabTypes)) {
      throw new Error("type in request body is not valid");
    }

    // let matchAggregate = [
    //   {
    //     $match: {
    //       type: body.type,
    //       buildingComponents: body.buildingComponents,
    //     },
    //   },
    // ];

    // const result = await SectionModel.aggregate(matchAggregate);
    // if (result.length > 0) {
    //   throw new Error("Section with same name already exist");
    // }

    const doc: ISectionModel = await MaterialService.insertWithSubMaterials(
      req.body
    );
    res.status(200).json(doc);
  } catch (error) {
    logger.error("error", error, {
      file: "material -> material.controller.ts -> insertWithSubMaterials",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}

export async function pushInSubMaterials(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;
    const subMaterialsToPush = body.subMaterials;
    const materialId = body.materialId; //section ID

    if (!subMaterialsToPush || !Array.isArray(subMaterialsToPush)) {
      throw new Error("subMaterials should be an array");
    }
    if (!materialId) {
      throw new Error("materialId is required");
    }
    const validate: Joi.ValidationResult<any> = materialValidation.checkIdValidation(
      { id: materialId }
    );
    if (validate.error) {
      throw new Error(validate.error.message);
    }

    const aggregate = [
      {
        $match: {
          _id: Types.ObjectId(materialId), //section ID
        },
      },
      {
        $lookup: {
          from: "SubMaterials",
          localField: "subMaterials",
          foreignField: "_id",
          as: "subMaterials",
        },
      },
    ];
    const result = await SectionModel.aggregate(aggregate);

    if (result.length) {
      const subMaterials = result[0].subMaterials;

      await Promise.all(
        subMaterialsToPush.map(async (element) => {
          const masterMaterial = await MasterMaterialModel.findById(element);
          subMaterials.forEach((subMaterial: any) => {
            if (masterMaterial.application === subMaterial.application) {
              throw new Error("Material with same name already exist");
            }
          });
        })
      );
    }
    const doc: ISectionModel = await MaterialService.pushInSubMaterials(body);
    res.status(200).json(doc);
  } catch (error) {
    logger.error("error", error, {
      file: "material -> material.controller.ts -> pushInSubMaterials",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const validate: Joi.ValidationResult<any> = materialValidation.checkIdValidation(
      { id }
    );
    if (validate.error) {
      throw new Error(validate.error.message);
    }
    const doc: ISectionModel = await MaterialService.remove(id);
    res.status(200).json(doc);
  } catch (error) {
    logger.error("error", error, {
      file: "material -> material.controller.ts -> remove",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    next(new HttpError(error.message.status, error.message));
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    if (body.buildingComponents) {
      let matchAggregate = [
        {
          $match: {
            type: body.type,
            buildingComponents: body.buildingComponents,
          },
        },
      ];

      const result = await SectionModel.aggregate(matchAggregate);
      if (result.length > 0) {
        result.forEach((element) => {
          if (element._id != body._id) {
            throw new Error("Section with same name already exist");
          }
        });
      }
    }

    const doc: ISectionModel = await MaterialService.update(req.body);
    res.status(200).json(doc);
  } catch (error) {
    logger.error("error", error, {
      file: "material -> material.controller.ts -> update",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}

/** Materials API */
// DONE
export async function insertSubMaterial(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const element: IInsertSubMaterial = req.body;
    const validate: Joi.ValidationResult<IMaterialModel> = materialValidation.insertSubMaterial(
      element
    );

    if (validate.error) {
      throw new Error(validate.error.message);
    }
    // check id fag with this id exits
    // if (element.subject) {
    //     const fagDoc = await FagModel.findById(element.subject);
    //     if (!fagDoc) {
    //         throw new Error("Fag(subject) with id does not exits");
    //     }
    // }

    const body = req.body;
    const materialId = body.materialId;

    const aggregate = [
      {
        $match: {
          _id: Types.ObjectId(materialId),
        },
      },
      {
        $lookup: {
          from: "SubMaterials",
          localField: "subMaterials",
          foreignField: "_id",
          as: "subMaterials",
        },
      },
    ];
    const materialMatch: Array<any> = await SectionModel.aggregate(aggregate);
    if (!materialMatch.length) {
      throw new Error("Material with this materialId does not exist");
    }
    const subMaterials = materialMatch[0].subMaterials;
    if (subMaterials) {
      subMaterials.forEach((element: any) => {
        if (element.application === body.application) {
          throw new Error("Material with same name exist");
        }
      });
    }

    const doc = await MaterialService.insetSubMaterial(element);
    res.status(201).json(doc);
  } catch (error) {
    logger.error("error", error, {
      file: "material -> material.controller.ts -> insertSubMaterial",
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
          await MaterialModel.findByIdAndUpdate(doc._id, doc);
        }
      }
    }
    const result = await MaterialModel.findById(data._id);

    res.json(result);
  } catch (error) {
    logger.error("error", error, {
      file: "material -> material.controller.ts -> uploadDocument",
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
    await MaterialModel.findByIdAndUpdate(id, {
      fdvDocument: "",
    });
    const result = await MaterialModel.findById(id);

    res.json(result);
  } catch (error) {
    logger.error("error", error, {
      file: "material -> material.controller.ts -> deleteDocument",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    next(new HttpError(error.message.status, error.message));
  }
}

// DONE
export async function findSubMaterial(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const doc = await MaterialService.findSubMaterial(req.params.id);
    res.status(200).json(doc);
  } catch (error) {
    logger.error("error", error, {
      file: "material -> material.controller.ts -> findSubMaterial",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    next(new HttpError(error.message.status, error.message));
  }
}

// DONE
export async function updateSubMaterial(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;
    const validation: Joi.ValidationResult<IMaterialModel> = materialValidation.updateSubMaterial(
      body
    );
    if (validation.error) {
      throw new Error(validation.error.message);
    }

    // check if subject id is valid
    // if (body.subject) {
    //     const fagDoc = await FagModel.findById(body.subject);
    //     if (!fagDoc) {
    //         throw new Error("Fag(subject) with id does not exits");
    //     }
    // }

    const aggregate = [
      {
        $match: {
          subMaterials: Types.ObjectId(body._id),
        },
      },
      {
        $lookup: {
          from: "SubMaterials",
          localField: "subMaterials",
          foreignField: "_id",
          as: "subMaterials",
        },
      },
    ];

    const result = await SectionModel.aggregate(aggregate);
    if (result.length) {
      const subMaterials = result[0].subMaterials;
      if (subMaterials) {
        subMaterials.forEach((element: any) => {
          if (
            element._id != body._id &&
            element.application === body.application
          ) {
            throw new Error("Material with same name exist");
          }
        });
      }
    }

    const doc = await MaterialService.updateSubMaterial(req.body);
    res.status(200).json(doc);
  } catch (error) {
    logger.error("error", error, {
      file: "material -> material.controller.ts -> updateSubMaterial",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    next(new HttpError(error.message.status, error.message));
  }
}

export async function removeSubMaterial(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const validate: Joi.ValidationResult<any> = materialValidation.checkIdValidation(
      { id }
    );
    if (validate.error) {
      throw new Error(validate.error.message);
    }
    const doc: IMaterialModel = await MaterialService.removeSubMaterial(id);
    res.status(200).json(doc);
  } catch (error) {
    logger.error("error", error, {
      file: "material -> material.controller.ts -> removeSubMaterial",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    next(new HttpError(error.message.status, error.message));
  }
}

// export async function clearAllQuantity(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const doc: ISectionModel = await MaterialService.update(req.body);
//   } catch (err) {}
// }

export async function clearAllQuantity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const doc = await MaterialService.clearAllQuantity();
    res.status(200).json(doc);
  } catch (error) {
    logger.error("error", error, {
      file: "material -> material.controller.ts -> clearAllQuantity",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    next(new HttpError(error.message.status, error.message));
  }
}

export async function reorder(req: Request, res: Response, next: NextFunction) {
  try {
    const body: any = req.body;

    const validate: Joi.ValidationResult<any> = materialValidation.reorderValidation(body);
    if (validate.error) {
      throw new Error(validate.error.message);
    }
   
    let result: any;
    result = await MaterialService.reorderData(body);

    // const result = await MaterialService.reorderData(body);

    res.status(200).json(result);
  } catch (error) {
    logger.error("error", error, {
      file: "material -> material.controller.ts -> reorder",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    next(new HttpError(error.message.status, error.message));
  }
}
