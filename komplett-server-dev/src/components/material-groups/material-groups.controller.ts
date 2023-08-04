import { NextFunction, Response, Request } from "express";
import HttpError from "../../config/error";
import { logger } from "../../config/winston";
import * as Joi from "joi";
import {
  IGroupModel,
  IGroupQueryModel,
  ISubgroupModel,
  SubgroupsModel,
} from "./material-groups.model";
import materialGroupsValidation from "./material-groups.validation";
import materialGroupsDao from "./material-groups.dao";
import { MasterMaterialModel } from "../master-material/master-material.model";
import { Types } from "mongoose";
import materialSubgroupsDao from "./material-subgroups.dao";
import materialSubgroupsValidation from "./material-subgroups.validation";

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function findAll(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let groups: IGroupModel[];
    groups = await materialGroupsDao.getAll(req.query);
    res.status(200).json(groups);
  } catch (error) {
    logger.error("error", error, {
      file: "material-groups -> material-groups.controller.ts -> findAll",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    next(new HttpError(error.message.status, error.message));
  }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let body: IGroupModel = req.body;
    const validate: Joi.ValidationResult<IGroupModel> = materialGroupsValidation.createGroup(
      body
    );
    if (validate.error) {
      throw new Error(validate.error.message);
    }
    const group: IGroupModel = await materialGroupsDao.insert(body);
    res.status(201).json(group);
  } catch (error) {
    logger.error("error", error, {
      file: "material-groups -> material-groups.controller.ts -> create",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let body: IGroupModel = req.body;
    const validate: Joi.ValidationResult<IGroupModel> = materialGroupsValidation.createGroup(
      body
    );
    if (validate.error) {
      throw new Error(validate.error.message);
    }
    const group: IGroupModel = await materialGroupsDao.update(body._id, body);
    res.status(201).json(group);
  } catch (error) {
    logger.error("error", error, {
      file: "material-groups -> material-groups.controller.ts -> update",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}

// NOTE :  user is not deleted from db right now ,only making activate variable false from use table
export async function deleteGroup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id: string = req.params.id;
    const validate: Joi.ValidationResult<any> = materialGroupsValidation.checkIdValidation(
      { id }
    );
    if (validate.error) {
      throw new Error(validate.error.message);
    }

    const MasterMaterial = await MasterMaterialModel.findOne({
      groupId: Types.ObjectId(id),
    });

    if (MasterMaterial) {
      throw new Error(
        "This Group already used in some master material, you can't delete it."
      );
    }

    const doc: IGroupModel = await materialGroupsDao.deleteRecord(id);
    res.json(doc);
  } catch (error) {
    logger.error("error", error, {
      file: "material-groups -> material-groups.controller.ts -> deleteGroup",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function addSubgroup(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let groups: ISubgroupModel;
    groups = await materialSubgroupsDao.addSubgroupRecord(req.body);
    res.status(200).json(groups);
  } catch (error) {
    logger.error("error", error, {
      file: "material-groups -> material-groups.controller.ts -> addSubgroup",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    next(new HttpError(error.message.status, error.message));
  }
}

export async function updateSubgroup(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body: ISubgroupModel = req.body;
    const groups: ISubgroupModel = await materialSubgroupsDao.update(
      body._id,
      body
    );
    res.status(200).json(groups);
  } catch (error) {
    logger.error("error", error, {
      file:
        "material-groups -> material-groups.controller.ts -> updateSubgroup",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    next(new HttpError(error.message.status, error.message));
  }
}

export async function deleteSubgroup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id: string = req.params.id;
    const validate: Joi.ValidationResult<any> = materialSubgroupsValidation.checkIdValidation(
      { id }
    );
    if (validate.error) {
      throw new Error(validate.error.message);
    }

    // const subGroup: any = await SubgroupsModel.findById(id);

    // const MasterMaterial = await MasterMaterialModel.findOne({
    //   groupId: Types.ObjectId(subGroup.groupId),
    // });

    // console.log("group", MasterMaterial);

    // if (MasterMaterial) {
    //   throw new Error(
    //     "This Group already used with this Subgroup in some master material, you can't delete it."
    //   );
    // }

    const doc: ISubgroupModel = await materialSubgroupsDao.deleteSubgroupRecord(id);
    res.json(doc);
  } catch (error) {
    logger.error("error", error, {
      file:
        "material-groups -> material-groups.controller.ts -> deleteSubgroup",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    res.status(400).json({ message: error.message || error });
  }
}
