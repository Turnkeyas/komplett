import UserService from './user.dao';
import { HttpError } from '../../config/error';
import { IUserModel } from './user.model';
import { NextFunction, Request, Response } from 'express';
import * as Joi from 'joi';
import UserValidation from './user.validation';
import { logger } from '../../config/winston';

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const users: IUserModel[] = await UserService.findAll();
        res.status(200).json(users);
    } catch (error) {
        logger.error('error', error, { file: 'user -> user.controller.ts -> findAll', request: req.method + ' :' + req.baseUrl + req.url })
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
export async function findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        let id = req.params.id;
        const validate: Joi.ValidationResult<{
            id: string
        }> = UserValidation.getUser({
            id
        });
        if (validate.error) {
            throw new Error(validate.error.message);
        }
        const user: IUserModel = await UserService.findOne(id);
        res.status(200).json(user);
    } catch (error) {
        logger.error('error', error, { file: 'user -> user.controller.ts -> findOne', request: req.method + ' :' + req.baseUrl + req.url })
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
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        let body = req.body;
        const validate: Joi.ValidationResult<IUserModel> = UserValidation.createUser(body);
        if (validate.error) {
            throw new Error(validate.error.message);
        }
        const user: IUserModel = await UserService.insert(body);
        res.status(201).json(user);
    } catch (error) {
        logger.error('error', error, { file: 'user -> user.controller.ts -> create', request: req.method + ' :' + req.baseUrl + req.url })
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
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        let id = req.params.id;
        const validate: Joi.ValidationResult<{
            id: string
        }> = UserValidation.removeUser({
            id
        });
        if (validate.error) {
            throw new Error(validate.error.message);
        }

        const user: IUserModel = await UserService.remove(id);
        res.status(200).json(user);
    } catch (error) {
        logger.error('error', error, { file: 'user -> user.controller.ts -> remove', request: req.method + ' :' + req.baseUrl + req.url })
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
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        let body = req.body;
        const validate: Joi.ValidationResult<IUserModel> = UserValidation.updateUser(body);
        if (validate.error) {
            throw new Error(validate.error.message);
        }
        const user: IUserModel = await UserService.update(body);
        if (user === null) {
            next(new HttpError(404, "User not found with this id"));
            return;
        }
        res.status(204).end();
    } catch (error) {
        logger.error('error', error, { file: 'user -> user.controller.ts -> update', request: req.method + ' :' + req.baseUrl + req.url })
        next(new HttpError(error.message.status, error.message))
    }
}
