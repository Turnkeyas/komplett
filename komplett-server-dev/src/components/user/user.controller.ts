import UserService from "./user.dao";
import { HttpError } from "../../config/error";
import { IUserModel } from "./user.model";
import { NextFunction, Request, Response } from "express";
import * as Joi from "joi";
import UserValidation from "./user.validation";
import { logger } from "../../config/winston";
import { USERROLES } from "../../constants/constants";
import * as bcrypt from "bcrypt";

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
    const role: any = req.query.role || "all";

    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const order = req.query.order;
    const sort = req.query.sort;

    const config: any = {
      limit,
      page,
      sort,
      order,
      role,
    };
    const users: any = await UserService.findAll(config);
    res.status(200).json(users);
  } catch (error) {
    logger.error("error", error, {
      file: "user -> user.controller.ts -> findAll",
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
export async function findOne(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let id = req.params.id;
    const validate: Joi.ValidationResult<{
      id: string;
    }> = UserValidation.getUser({
      id,
    });
    if (validate.error) {
      throw new Error(validate.error.message);
    }
    const user: IUserModel = await UserService.findOne(id);
    res.status(200).json(user);
  } catch (error) {
    logger.error("error", error, {
      file: "user -> user.controller.ts -> findOne",
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
    let body: IUserModel = req.body;
    if (body.email) {
      body.email = body.email.toLowerCase();
    }
    if (!body.role) {
      throw new Error("Role is Required Field");
    }

    if (body.role == USERROLES.EMPLOYEE || body.role == USERROLES.CUSTOMER) {
      throw new Error(
        `Can't create ${body.role} with this api, please use ${body.role} api`
      );
    }
    const validate: Joi.ValidationResult<IUserModel> = UserValidation.createUser(
      body
    );
    if (validate.error) {
      throw new Error(validate.error.message);
    }
    const user: IUserModel = await UserService.insert(body);
    res.status(201).json(user);
  } catch (error) {
    logger.error("error", error, {
      file: "user -> user.controller.ts -> create",
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
export async function remove(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let id = req.params.id;
    const validate: Joi.ValidationResult<{
      id: string;
    }> = UserValidation.removeUser({
      id,
    });
    if (validate.error) {
      throw new Error(validate.error.message);
    }
    const user: IUserModel = await UserService.remove(id);
    res.status(200).json(user);
  } catch (error) {
    logger.error("error", error, {
      file: "user -> user.controller.ts -> remove",
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
 * @returns {Promise< void >}
 */
export async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let body: IUserModel = req.body;
    if (body.email) {
      body.email = body.email.toLowerCase();
    }
    const validate: Joi.ValidationResult<IUserModel> = UserValidation.updateUser(
      body
    );
    if (validate.error) {
      throw new Error(validate.error.message);
    }

    if (body.role) {
      if (body.role == USERROLES.EMPLOYEE || body.role == USERROLES.CUSTOMER) {
        throw new Error(
          `Can't update ${body.role} with this api, please use ${body.role} api`
        );
      }
    }
    const user: IUserModel = await UserService.update(body);
    delete user.password;
    if (user === null) {
      next(new HttpError(404, "User not found with this id"));
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error("error", error, {
      file: "user -> user.controller.ts -> update",
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
 * @returns {Promise< void >}
 */
export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let body: any = req.body;
    const userId = req.params.id;
    const user: IUserModel = await UserService.findOne(userId);
    if (!user) {
      throw new Error("user not found");
    }
    const isMatched: boolean =
      user && (await user.comparePassword(body.oldPassword));

    if (!isMatched) {
      throw new Error("Invaild old password");
    }
    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(body.password, salt);
    user.password = hash;
    const obj: any = {
      _id: user._id,
      password: hash,
    };
    const updatedUser: IUserModel = await UserService.update(obj);
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error("error", error, {
      file: "user -> user.controller.ts -> changePassword",
      request: req.method + " :" + req.baseUrl + req.url,
    });
    next(new HttpError(error.message.status, error.message));
  }
}
