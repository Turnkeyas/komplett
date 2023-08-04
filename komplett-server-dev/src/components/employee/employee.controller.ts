import { Request, Response, NextFunction } from "express";
import employeeValidation from "./employee.validation";
import * as Joi from 'joi';
import employeeDao from "./employee.dao";
import { paginationConfig } from "../dao";
import { logger } from "../../config/winston";

export async function findEmployees(req: any, res: Response, next: NextFunction) {
    try {
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const order = req.query.order;
        const sort = req.query.sort;
        const config: paginationConfig = {
            limit, page, sort, order
        }

        const employees = await employeeDao.findAllEmployee(config);
        res.status(200).json(employees);
    } catch (error) {
        logger.error('error', error, { file: 'employee -> employee.controller.ts -> findEmployees', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}


export async function findEmployeeById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const validate: Joi.ValidationResult<any> = employeeValidation.checkIdValidation({ id });
        if (validate.error) {
            throw new Error(validate.error.message);
        }
        const response = await employeeDao.findEmployeeById(id);
        res.json(response);
    } catch (error) {
        logger.error('error', error, { file: 'employee -> employee.controller.ts -> findEmployeeById', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error });
    }
}

export async function insertEmployee(req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body;
        const validate: Joi.ValidationResult<any> = employeeValidation.insertEmployeeValidation(body);
        if (validate.error) {
            throw new Error(validate.error.message);
        }
        const response = await employeeDao.insertEmployee(body);
        res.json(response);
    } catch (error) {
        logger.error('error', error, { file: 'employee -> employee.controller.ts -> insertEmployee', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

export async function updateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body;
        const validate: Joi.ValidationResult<any> = employeeValidation.updateEmployeeValidation(body);
        if (validate.error) {
            throw new Error(validate.error.message);
        }
        const response = await employeeDao.updateEmployee(body);
        res.json(response);
    } catch (error) {
        logger.error('error', error, { file: 'employee -> employee.controller.ts -> updateEmployee', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

// NOTE :  user is not deleted from db right now ,only making activate variable false from use table 
export async function deleteEmployee(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const validate: Joi.ValidationResult<any> = employeeValidation.checkIdValidation({ id });
        if (validate.error) {
            throw new Error(validate.error.message);
        }
        const response = await employeeDao.deleteEmployee(id);
        res.status(200).json(response);
    } catch (error) {
        logger.error('error', error, { file: 'employee -> employee.controller.ts -> deleteEmployee', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}