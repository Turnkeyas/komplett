import AuthService from './auth.service';
import HttpError from '../../config/error';
import { IUserModel } from '../user/user.model';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import app from '../../config/server/server';
import { logger } from '../../config/winston';

/**
 * @export
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {Promise < void >}
 */
export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = req.body;
        user.email = user.email.toLowerCase();
        const userDoc: IUserModel = await AuthService.createUser(user);
        const token: string = fnSignToken({ id: userDoc._id, email: userDoc.email });
        res.json({
            status: 200,
            logged: true,
            token: token,
            message: 'Sign Up successfully'
        });
    } catch (error) {
        logger.error('error', error, { file: 'auth -> auth.controller.ts -> signup', request: req.method + ' :' + req.baseUrl + req.url })
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(400).json({
            status: 400,
            message: error.message
        });
    }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = req.body;
        user.email = user.email.toLowerCase();
        const userDoc: IUserModel = await AuthService.getUser(user);
        const token: string = fnSignToken({ id: userDoc._id, email: userDoc.email });
        res.json({
            status: 200,
            logged: true,
            token: token,
            message: 'Sign in successfull'
        });

    } catch (error) {
        logger.error('error', error, { file: 'auth -> auth.controller.ts -> login', request: req.method + ' :' + req.baseUrl + req.url })
        if (error.code === 500) {
            return next(new HttpError(error.message.status, error.message));
        }
        res.status(400).json({
            status: 400,
            message: error.message
        });
    }
}


/**
 * Returns a jwt token signed by the app secret
 * Value of expiresIn is measured in seconds SS:MM:HH
 * JWT token expires in one day.
 * @param user
 * @return JWT token as string
 */
export function fnSignToken(obj: any) {
    return jwt.sign(obj, app.get('secret'), { expiresIn: 60 * 60 * 24 * 7 });
}