import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { logger } from "../../config/winston";
import { TASKSTATUS } from "../../constants/constants";
import DAO, { paginationConfig } from "../dao";
import projectDao from "../project/project.dao";
import taskDao from "./task.dao";
import taskValidation from './task.validation';

export async function findAllTask(req: any, res: Response, next: NextFunction) {
    try {
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const order = req.query.order;
        const sort = req.query.sort;
        const projectId = req.query.projectId;
        let status: string = req.query.status || 'all';
        status = status.toUpperCase();
        if (status !== 'ALL') {
            if (!(status in TASKSTATUS)) {
                status = 'ALL';
            }
        }

        if (!projectId) {
            throw new Error('projectId must be available in query params');
        }

        const validation = taskValidation.checkIdValidation({ id: projectId });
        if (validation.error) {
            throw new Error(validation.error.message);
        }

        const config: paginationConfig = {
            limit, page, sort, order
        }
        const tasks = await taskDao.findTaskByProjectId(projectId, status, config);
        res.status(200).json(tasks);

    } catch (error) {
        logger.log('error', error, { file: 'task -> task.controller.ts -> findAllTask', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}


export async function getTaskById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const validation = taskValidation.checkIdValidation({ id });
        if (validation.error) {
            throw new Error(validation.error.message);
        }
        const task = await taskDao.getTaskById(id);
        res.status(200).json(task);
    } catch (error) {
        logger.error('error', error, { file: 'task -> task.controller.ts -> getTaskById', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error });
    }
}



export async function insertTask(req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body;
        const validation = taskValidation.insertTaskValidation(body);
        if (validation.error) {
            throw new Error(validation.error.message);
        }
        const response = await taskDao.insertTask(body);
        res.status(201).json(response);
    } catch (error) {
        logger.log('error', error, { file: 'task -> task.controller.ts -> insertTask', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body;
        const id = body._id;
        const validation = taskValidation.checkIdValidation({ id });
        if (validation.error) {
            throw new Error(validation.error.message);
        }
        const response = await taskDao.updateTask(body);
        res.status(200).json(response);
    } catch (error) {
        logger.log('error', error, { file: 'task -> task.controller.ts -> updateTask', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}


export async function deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const validation = taskValidation.checkIdValidation({ id });
        if (validation.error) {
            throw new Error(validation.error.message);
        }
        const deletedDoc = await taskDao.deleteRecord(id);
        res.status(200).json(deletedDoc);
    } catch (error) {
        logger.log('error', error, { file: 'task -> task.controller.ts -> deleteTask', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

/**
 * specifications: The fields to
 *   include or exclude.
 */
// $project : {
//     tasks : {
//       $filter : {
//         input : "$tasks",
//         as : "task", 
//         cond : {$eq :['$$task', ObjectId('5f9f8aabd9bb99369c51923d')]}
//       }
//     }
//   }