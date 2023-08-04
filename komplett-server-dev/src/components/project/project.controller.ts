import { Request, Response, NextFunction } from "express";
import { logger } from "../../config/winston";
import { PROJECTSTATUS } from "../../constants/constants";
import { paginationConfig } from "../dao";
import ProjectDao from './project.dao';
import projectDao from "./project.dao";
import ProjectValidation from "./project.validation";

export async function findAllProjects(req: any, res: Response, next: NextFunction) {
    try {
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const order = req.query.order;
        const sort = req.query.sort;
        let status: string = req.query.status || 'all';
        const projectName = req.query.projectName;


        status = status.toUpperCase();
        if (status !== 'ALL') {
            if (!(status in PROJECTSTATUS)) {
                status = 'ALL';
            }
        }
        const config: any = {
            limit, page, sort, order, projectName
        }

        const response = await ProjectDao.findAllProjects(config, status);
        res.status(200).json(response)
    } catch (error) {
        logger.error('error', error, { file: 'project -> project.controller.ts -> findAllProjects', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

export async function getProjectById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const validation = ProjectValidation.checkIdValidation({ id });
        if (validation.error) {
            throw new Error(validation.error.message);
        }
        const project = await projectDao.getProjectById(id);
        res.status(200).json(project);
    } catch (error) {
        logger.error('error', error, { file: 'project -> project.controller.ts -> getProjectById', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error });
    }
}

export async function insertProject(req: Request, res: Response, next: NextFunction) {
    try {
        const newProj = await projectDao.insertProject(req.body);
        res.status(201).json(newProj);
    } catch (error) {
        logger.error('error', error, { file: 'project -> project.controller.ts -> insertProject', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

export async function findProjectByCustomerId(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const validation = ProjectValidation.checkIdValidation({ id });
        if (validation.error) {
            throw new Error(validation.error.message);
        }
        const projects = await projectDao.getProjectsByCustomerId(id);
        res.status(200).json(projects);
    } catch (error) {
        logger.error('error', error, { file: 'project -> project.controller.ts -> findProjectByCustomerId', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error })
    }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const validation = ProjectValidation.checkIdValidation({ id });
        if (validation.error) {
            throw new Error(validation.error.message);
        }
        const project = await projectDao.deleteRecord(id);
        res.status(204).end();
    } catch (error) {
        logger.error('error', error, { file: 'project -> project.controller.ts -> deleteProject', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error });
    }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
    try {
        const data = req.body;
        const id = data._id;
        const validation = ProjectValidation.checkIdValidation({ id });
        if (validation.error) {
            throw new Error(validation.error.message);
        }
        const project = await projectDao.updateProject(data);
        res.status(200).json(project);
    } catch (error) {
        logger.error('error', error, { file: 'project -> project.controller.ts -> updateProject', request: req.method + ' :' + req.baseUrl + req.url })
        res.status(400).json({ message: error.message || error });
    }
}