import { lookupService } from "dns";
import { Model, Types } from "mongoose";
import { TASKSTATUS } from "../../constants/constants";
import DAO, { paginationConfig } from "../dao";
import locationDao from "../location/location.dao";
import LocationDAO from "../location/location.dao";
import { ILocationModel } from "../location/location.model";
import { IProjectModel, ProjectModel } from './project.model';

class ProjectDAO extends DAO {
    model: Model<IProjectModel> = ProjectModel;
    lookupCustomer = {
        $lookup: {
            from: 'Customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer'
        }
    }
    lookupLocation = {
        $lookup: {
            from: 'Locations',
            localField: 'locationId',
            foreignField: '_id',
            as: 'location'
        }
    }
    userAggregate = {
        $lookup: {
            from: 'usermodel',
            localField: 'customer.userId',
            foreignField: '_id',
            as: 'user'
        }
    }

    unwindUser = {
        $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true
        }
    }
    unwindLocation = {
        $unwind: {
            path: '$location',
            preserveNullAndEmptyArrays: true
        }
    }
    unwindCustomer = {
        $unwind: {
            path: '$customer',
            preserveNullAndEmptyArrays: true
        }
    }

    insertProject = async (body: any) => {
        try {
            const location = body.location;
            if (location) {
                const locationDoc = await LocationDAO.insert<ILocationModel>(location);
                body.locationId = locationDoc._id;
            }

            const newProject = await this.insert<IProjectModel>(body);
            return newProject;
        } catch (error) {
            throw new Error(error)
        }
    }


    findAllProjects = async (config: any, status: string = 'all') => {
        try {
            let aggregate = [];

            const regEx = new RegExp(`${config.projectName}`, 'i');
            const projectNameAggregate = { $match: { 'name': regEx } };
            if (config.projectName) {
                console.log(config.projectName, projectNameAggregate);
                aggregate.push(projectNameAggregate);
            }
            let result: any;

            const taskLookup = {
                $lookup: {
                    from: 'Tasks',
                    localField: 'tasks',
                    foreignField: '_id',
                    as: 'tasksArr'
                }
            }

            aggregate.push(this.lookupCustomer, this.lookupLocation, taskLookup, this.userAggregate, this.unwindUser, this.unwindCustomer, this.unwindLocation);

            if (status !== 'ALL') {
                let matchStatus = {
                    $match: {
                        status: status,
                    }
                }

                aggregate.unshift(matchStatus);
                // console.log(aggregate);
                result = await this.fnGetByConfigration({ ...config, lookupAggregate: aggregate });
            } else {
                // console.log(aggregate);
                result = await this.fnGetByConfigration({ ...config, lookupAggregate: aggregate });
            }

            // console.log(result);
            // let taskCompleted = 0;
            // result.data[0].tasksArr.forEach((element: any) => {
            //     if (element && element.status && element.status === TASKSTATUS.COMPLETED) {
            //         taskCompleted += 1;
            //     }
            // });
            // result.data[0].taskCompleted = taskCompleted;

            result.data.forEach((project: any, index: any) => {
                project.tasksArr.forEach((task: any) => {
                    if (task && task.status && task.status === TASKSTATUS.COMPLETED) {
                        project.taskCompleted ? project.taskCompleted = 1 + project.taskCompleted : project.taskCompleted = 1
                    }
                });

                delete project.tasksArr;
            });


            // console.log(result.data)

            return result;
        } catch (error) {
            throw new Error(error)
        }
    }

    getProjectById = async (id: string) => {
        try {
            const match = {
                $match: {
                    _id: Types.ObjectId(id)
                }
            }
            const aggregate = [];
            aggregate.push(match, this.lookupLocation, this.lookupCustomer, this.userAggregate, this.unwindUser, this.unwindCustomer, this.unwindLocation);
            const project: any = await this.model.aggregate(aggregate);
            return project;
        } catch (error) {
            throw new Error(error)
        }
    }


    getProjectsByCustomerId = async (customerId: string) => {
        try {
            const matchAggregate = {
                $match: {
                    customerId: Types.ObjectId(customerId)
                }
            };
            const result = await this.model.aggregate([matchAggregate, this.lookupLocation, this.lookupCustomer, this.userAggregate, this.unwindUser, this.unwindCustomer, this.unwindLocation]);
            return result;
        } catch (error) {
            throw new Error(error)
        }
    }

    updateProject = async (data: any) => {

        try {
            // cannot update locationId or userId
            if (data.locationId) {
                delete data.locationId;
            }
            if (data.userId) {
                delete data.userId;
            }

            if (data.location) {
                if (!data.location._id) { throw new Error('_id not available in "data.location"') }
                const location = await locationDao.update(data.location._id, data.location);
            }

            const updatedProject = await this.update(data._id, data);
            return updatedProject;
        } catch (error) {
            throw new Error(error);
        }
    }

}
export default new ProjectDAO();