import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { logger } from "../../config/winston";
import offerTemplateDao from "./offer-template.dao";
import { IOfferTemplateModel } from "./offer-template.model";
import offerTemplateValidator from "./offer-template.validator";

export async function findOfferTemplate(req: Request, res: Response, next: NextFunction) {
    try {
        const docs: IOfferTemplateModel[] = await offerTemplateDao.fnGetAll<IOfferTemplateModel>();
        res.json(docs);
    } catch (error) {
        logger.log('error', error, { file: 'offer-template -> offer-template.controller.ts -> findOfferTemplate', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

export async function insertOfferTemplate(req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body;
        const doc: IOfferTemplateModel = await offerTemplateDao.insert<IOfferTemplateModel>(body);
        return doc;
    } catch (error) {
        logger.log('error', error, { file: 'offer-template -> offer-template.controller.ts -> insertOfferTemplate', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

export async function updateOfferTemplate(req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body;
        const validation = offerTemplateValidator.checkIdValidation({ id: body._id });
        if (validation.error) {
            throw new Error(validation.error.message);
        }
        const findDoc = await offerTemplateDao.fnGet(body._id);
        if (!findDoc) {
            throw new Error("No Offer Template item available with this id");
        }
        const doc: IOfferTemplateModel = await offerTemplateDao.update<IOfferTemplateModel>(body._id, body);
        res.json(doc);
    } catch (error) {
        logger.log('error', error, { file: 'offer-template -> offer-template.controller.ts -> updateOfferTemplate', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}


export async function deleteOfferTemplate(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const doc: IOfferTemplateModel = await offerTemplateDao.deleteRecord<IOfferTemplateModel>(id);
        return doc;
    } catch (error) {
        logger.log('error', error, { file: 'offer-template -> offer-template.controller.ts -> deleteOfferTemplate', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}
