import { string } from 'joi';
import { Mongoose, Schema, Document, Types, Model } from 'mongoose';
import * as connections from '../../config/connection/connection';
import { PROJECTSTATUS } from '../../constants/constants';
import locationDao from '../location/location.dao';
import taskDao from '../task/task.dao';

export interface IProjectModel extends Document {
    name: string,
    description: string,
    contactPersonName: string,
    contactPersonEmail: string,
    contactPersonPhoneNumber: string,
    projectNumber: number,
    status: string,
    estimatedHours: number,
    registeredHours: number,
    startDate: Date,
    completionDate: Date,
    deadLine: Date,

    // relations
    locationId: string,
    customerId: string,
    tasks: Array<string>,
    projectManager: string
}


/**
 * @swagger
 * components:
 *  schemas:
 *    ProjectSchema:
 *      properties:
 *        name:
 *          type: string
 *        description:
 *          type: string
 *        contactPersonName:
 *          type: string
 *        contactPersonEmail:
 *          type: string
 *        contactPersonPhoneNumber:
 *          type: string
 *        projectNumber:
 *          type: number
 *        status:
 *          type: string
 *        estimatedHours:
 *          type: number
 *        registeredHours:
 *          type: number
 *        startDate:
 *          type: date
 *        completionDate:
 *          type: date
 *        deadLine:
 *          type: date
 *        locationId:
 *          type: string
 *        customerId:
 *          type: string
 *        location:
 *          type: object  
 *          $ref : '#/components/schemas/LocationSchema'
 *        customer:
 *          $ref : '#/components/schemas/CustomerSchema' 
 * 
 */
const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    desciption: String,
    contactPersonName: String,
    contactPersonEmail: String,
    contactPersonPhoneNumber: String,
    projectNumber: Number,
    status: {
        type: String,
        enum: [PROJECTSTATUS.ACTIVE, PROJECTSTATUS.CANCELLED, PROJECTSTATUS.COMPLETED, PROJECTSTATUS.ONGOING, PROJECTSTATUS.ONHOLD, PROJECTSTATUS.PLANNED],
        default: PROJECTSTATUS.ACTIVE
    },
    estimatedHours: Number,
    registeredHours: Number,
    startDate: Date,
    completionDate: Date,
    deadLine: Date,

    //relations
    locationId: {
        type: Types.ObjectId,
        ref: 'LocationModel'
    },
    customerId: {
        type: Types.ObjectId,
        ref: 'CustomerModel'
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'TaskModel'
        }
    ],
    projectManager: {
        type: Types.ObjectId,
        ref: 'EmployeeModel'
    }
    // NOTE: impletent after task and employee module creation
    // manager
}, { collection: 'Projects', timestamps: true });

projectSchema.post('remove', async function (doc: IProjectModel, next) {
    try {
        const self = this;
        // remove location ref from location table
        if (self.locationId) {
            await locationDao.deleteRecord(self.locationId);
        }

        let tasks = doc.tasks;

        // also delete all the tasks associated with project
        tasks.forEach(async (task) => {
            await taskDao.deleteRecord(task);
        });
        next();
        // shold not remove employee and customer
    } catch (error) {
        throw new Error(error);
    }
});


const ProjectModel: Model<IProjectModel> = connections.db.model<IProjectModel>('ProjectModel', projectSchema)
export {
    ProjectModel
}
