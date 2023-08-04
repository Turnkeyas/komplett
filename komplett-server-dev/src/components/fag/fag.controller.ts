import { Request, Response, NextFunction } from "express";
import * as Joi from 'joi';
import { paginationConfig } from "../dao";
import { logger } from "../../config/winston";
import fagService from "./fag.service";
import { IFagModel } from "./fag.model";
import fagValidation from "./fag.validation";
import fagDao from "./fag.dao";

export async function findFags(req: any, res: Response, next: NextFunction) {
    try {
        const docs: IFagModel[] = await fagService.findFags();
        res.json(docs);
    } catch (error) {
        logger.error('error', error, { file: 'fag -> fag.controller.ts -> findFags', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

export async function checkFagIsUsed(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const docs: IFagModel[] = await fagService.checkIsFagUsed(id);
        res.json(docs);
    } catch (error) {
        logger.error('error', error, { file: 'fag -> fag.controller.ts -> checkFagIsUsed', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}


export async function insertFag(req: Request, res: Response, next: NextFunction) {
    try {
        const body: IFagModel = req.body;
        const doc: IFagModel = await fagService.insertFag(body);
        res.json(doc);
    } catch (error) {
        logger.error('error', error, { file: 'fag -> fag.controller.ts -> insertFag', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error });
    }
}


export async function updateFag(req: Request, res: Response, next: NextFunction) {
    try {
        const body: IFagModel = req.body;
        if (!body._id) {
            throw new Error("_id is required field in body");
        }
        const validate: Joi.ValidationResult<any> = fagValidation.checkIdValidation({ id: body._id });
        if (validate.error) {
            throw new Error(validate.error.message);
        }
        const doc: IFagModel = await fagService.updateFag(body);
        res.json(doc);
    } catch (error) {
        logger.error('error', error, { file: 'fag -> fag.controller.ts -> updateFag', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

// NOTE :  user is not deleted from db right now ,only making activate variable false from use table 
export async function deleteFag(req: Request, res: Response, next: NextFunction) {
    try {
        const id: string = req.params.id;
        const validate: Joi.ValidationResult<any> = fagValidation.checkIdValidation({ id });
        if (validate.error) {
            throw new Error(validate.error.message);
        }

        const doc: IFagModel = await fagService.deleteFag(id);
        res.json(doc);
    } catch (error) {
        logger.error('error', error, { file: 'fag -> fag.controller.ts -> deleteFag', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}



export async function replaceFag(req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body;
        const oldFagId = body.oldFagId;
        const newFagId = body.newFagId;
        if (!oldFagId || !newFagId) {
            throw new Error("oldFagId and newFagId is required fields");
        }
        const validate: Joi.ValidationResult<any> = fagValidation.checkIdValidation({ id: oldFagId });
        const validate2: Joi.ValidationResult<any> = fagValidation.checkIdValidation({ id: newFagId });
        if (validate.error || validate2.error) {
            throw new Error(validate.error.message || validate2.error.message);
        }
        const oldDoc = fagDao.fnGet(oldFagId);
        const newDoc = fagDao.fnGet(newFagId);
        if (!oldDoc) {
            throw new Error("No document exits with oldFagId");
        }
        if (!newDoc) {
            throw new Error("No document exits with newFagId");
        }
        const doc: IFagModel = await fagService.replaceFag(oldFagId, newFagId);
        res.sendStatus(204);
    } catch (error) {
        logger.error('error', error, { file: 'fag -> fag.controller.ts -> replaceFag', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error });
    }
}
