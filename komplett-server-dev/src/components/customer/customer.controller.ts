import { Request, Response, NextFunction } from "express";
import customerDao from "./customer.dao";
import CustomerDao from './customer.dao';
import { paginationConfig } from '../dao';
import * as Joi from 'joi';
import CustomerValidation from './customer.validation';
import { logger } from '../../config/winston';

export async function insertCustomer(req: Request, res: Response, next: NextFunction) {
    try {
        const validate: Joi.ValidationResult<any> = CustomerValidation.insertCustomerValidation(req.body);
        if (validate.error) {
            throw new Error(validate.error.message);
        }
        const response = await CustomerDao.insertCustomer(req.body);
        res.status(201).json(response)
    } catch (error) {
        logger.error('error', error, { file: 'customer -> customer.controller.ts -> insertCustomer', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

// export async function findByName(req: any, res: Response, next: NextFunction) {
//     try {
//         const response = await customerDao.findCustomerByName(req.params.name);
//         res.status(200).json(response)
//     } catch (error) {
//         logger.error('error', error, { file: 'customer -> customer.controller.ts -> findByName', request: req.method + ' :' + req.baseUrl + req.url })
//         res.status(400).json({ message: error.message || error })
//     }
// }

export async function findCustomer(req: any, res: Response, next: NextFunction) {
    try {
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const order = req.query.order;
        const sort = req.query.sort;
        const customerName = req.query.customerName;

        const config: any = {
            limit, page, sort, order ,customerName
        }
        const response = await CustomerDao.findAllCustomer(config);
        res.json(response)
    } catch (error) {
        logger.error('error', error, { file: 'customer -> customer.controller.ts -> findCustomer', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

export async function findCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const validate: Joi.ValidationResult<any> = CustomerValidation.findCustomerByIdValidation({ id });
        if (validate.error) {
            throw new Error(validate.error.message);
        }
        const response = await CustomerDao.findCustomerById(id);
        res.json(response)
    } catch (error) {
        logger.error('error', error, { file: 'customer -> customer.controller.ts -> findCustomerById', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

export async function deleteCustomer(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const validate: Joi.ValidationResult<any> = CustomerValidation.findCustomerByIdValidation({ id });
        if (validate.error) {
            throw new Error(validate.error.message);
        }
        const result = await CustomerDao.deleteCustomer(id);
        res.status(204).end();
    } catch (error) {
        logger.error('error', error, { file: 'customer -> customer.controller.ts -> deleteCustomer', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

export async function updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
        const validate: Joi.ValidationResult<any> = CustomerValidation.updateCustomerValidation(req.body);
        if (validate.error) {
            // console.log("in error")
            throw new Error(validate.error.message);
        }
        const doc = await customerDao.updateCustomer(req.body);
        res.status(200).json(doc);
    } catch (error) {
        logger.error('error', error, { file: 'customer -> customer.controller.ts -> updateCustomer', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}