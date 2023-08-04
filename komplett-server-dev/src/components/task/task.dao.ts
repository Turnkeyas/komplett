import DAO, { paginationConfig } from "../dao";
import { TaskModel, ITaskModel } from "./task.model";
import { Model, Types } from "mongoose";
import projectDao from "../project/project.dao";
import { IProjectModel, ProjectModel } from "../project/project.model";
import { TASKSTATUS } from "../../constants/constants";

class TaskDAO extends DAO {
    model: Model<ITaskModel> = TaskModel;

    findTaskByProjectId = async (projectId: string, status: string, config: any) => {
        try {
            let configs: paginationConfig;
            const project = await projectDao.fnGet(projectId);
            // console.log(project);
            if (!project) {
                throw new Error("Project not available with this id");
            }

            // project
            // NOTE: aggregate to lookup task from project and employees (employee is left    )
            // let aggregate = [];
            // let lookUpTaskAggregate = {
            //     $lookup: {
            //         from: 'Tasks',
            //         localField: 'tasks',
            //         foreignField: '_id',
            //         as: 'task'
            //     }
            // }
            // aggregate.push(lookUpTaskAggregate);
            // const proj = await ProjectModel.aggregate(aggregate);
            // console.log(proj[0].task, 'proj')


            if (status != 'ALL') {
                let matchStatus = {
                    $match: {
                        status: status
                    }
                }
                configs = { ...config, matchField: "projectId", matchValue: Types.ObjectId(projectId), lookupAggregate: [matchStatus] }
            } else {
                configs = { ...config, matchField: "projectId", matchValue: Types.ObjectId(projectId) }
            }

            const tasks = await this.fnGetByConfigration(configs);
            return tasks;
        } catch (error) {
            throw new Error(error);
        }
    }

    getTaskById = async (id: string) => {
        try {
            const aggregate = []
            const matchId = {
                $match: {
                    _id: Types.ObjectId(id)
                }
            }
            let lookUpTaskAggregate = {
                $lookup: {
                    from: 'Employees',
                    localField: 'assignedEmployees',
                    foreignField: '_id',
                    as: 'employees'
                }
            }

            let userAggregate = {
                $lookup: {
                    from: 'usermodel',
                    localField: 'employees.userId',
                    foreignField: '_id',
                    as: 'user'
                }
            }

            aggregate.push(matchId, lookUpTaskAggregate, userAggregate)
            const result = await this.model.aggregate(aggregate);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    insertTask = async (data: any) => {
        try {
            const projectId = data.projectId;
            const project: IProjectModel = await projectDao.fnGet(projectId);
            if (!project) {
                throw new Error('Project not available with given id');
            }
            const taskDoc: ITaskModel = await this.insert(data);
            return taskDoc;
        } catch (error) {
            throw new Error(error);
        }
    }

    updateTask = async (data: any) => {
        try {
            if (data.projectId) {
                delete data.projectId;
            }
            const task = await this.update<ITaskModel>(data._id, data);
            return task;
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default new TaskDAO();