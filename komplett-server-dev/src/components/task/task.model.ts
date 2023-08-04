import { Schema, Types, Model, Document } from "mongoose";
import * as connections from '../../config/connection/connection';
import { TASKSTATUS } from "../../constants/constants";
import { IProjectModel, ProjectModel } from "../project/project.model";

export interface ITaskModel extends Document {
    name: string;
    description: string;
    status: string;
    estimation: number;
    reportedHours: number;
    progress: number;
    startDate: Date;
    deadLine: Date;
    completionDate: Date;
    availableForAllEmployees: Boolean;
    //relations
    assignedEmployees: Array<string>;
    projectId: String;
}


/**
 * @swagger
 * components:
 *  schemas:
 *    TaskSchema:
 *      properties:
 *        name:
 *          type: string
 *        status:
 *          type: string
 *        estimation:
 *          type: number
 *        reportedHours:
 *          type: number
 *        progress:
 *          type: number
 *        startDate:
 *          type: date
 *        deadLine:
 *          type: date
 *        completionDate:
 *          type: date
 *        description:
 *          type: string
 *        assignedEmployees:
 *          type: array
 *          example: []
 *          items: 
 *            $ref : '#/components/schemas/EmployeeSchema'
 *        availableForAllEmployees:
 *          type: boolean
 *        projectId:
 *          $ref : '#/components/schemas/ProjectSchema' 
 * 
 */
const taskSchema = new Schema({
    name: String,
    description: String,
    status: {
        type: String,
        enum: [TASKSTATUS.ACTIVE, TASKSTATUS.CANCELLED, TASKSTATUS.COMPLETED],
        default: TASKSTATUS.ACTIVE
    },
    estimation: Number,
    reportedHours: Number,
    progress: Number,
    startDate: Date,
    deadLine: Date,
    completionDate: Date,
    availableForAllEmployees: Boolean,
    //relations
    assignedEmployees: [
        {
            type: Types.ObjectId,
            ref: 'EmployeeModel'
        }
    ],
    projectId: {
        type: Types.ObjectId,
        ref: 'ProjectModel',
        required: true
    }
}, {
    collection: 'Tasks'
});


taskSchema.post('save', async (doc: ITaskModel, next) => {
    try {
        // insert in tasks array of projectDoc
        const update = await ProjectModel.findByIdAndUpdate(
            { _id: doc.projectId },
            {
                $push: {
                    tasks: doc._id
                }
            }
        );
        next();
    } catch (error) {
        throw new Error(error);
    }
});

taskSchema.post('remove', async (doc: ITaskModel, next) => {
    try {
        // remove task id from project 
        const projectId = doc.projectId;
        const update = await ProjectModel.findByIdAndUpdate(
            { _id: projectId },
            {
                $pull: {
                    tasks: doc._id
                }
            }
        )
        next();
    } catch (error) {
        throw new Error(error);
    }
})


export const TaskModel: Model<ITaskModel> = connections.db.model<ITaskModel>('TaskModel', taskSchema);