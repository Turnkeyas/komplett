import { Model, Schema, Document, Types } from 'mongoose';
import * as connections from '../../config/connection/connection';

export interface IEmployeeModel extends Document {
    employeeNumber: number,
    hseCardNumber: number,
    otherContactDetails: string,
    emergencyContactName: string,
    emergencyContactPhoneNumber: string,
    emergencyContactEmail: string,

    // relations
    userId: string,
    locationId: string
};


/**
 * @swagger
 * components:
 *  schemas:
 *    EmployeeSchema:
 *      properties:
 *        employeeNumber:
 *          type: number
 *        hseCardNumber:
 *          type: number
 *        otherContactDetails:
 *          type: string
 *        emergencyContactName:
 *          type: string
 *        emergencyContactPhoneNumber:
 *          type: string
 *        emergencyContactEmail:
 *          type: string
 *        locationId:
 *          type: string
 *        userId:
 *          type: string
 *        location:
 *          type: object  
 *          $ref : '#/components/schemas/LocationSchema'
 *        user:
 *          $ref : '#/components/schemas/UserSchema' 
 *    
 */
const employeeSchema = new Schema({
    employeeNumber: Number,
    hseCardNumber: Number,
    otherContactDetails: String,
    emergencyContactName: String,
    emergencyContactPhoneNumber: String,
    emergencyContactEmail: String,

    // relations
    userId: Types.ObjectId,
    locationId: Types.ObjectId
}, {
    collection: 'Employees',
    timestamps: true
});

const EmployeeModel: Model<IEmployeeModel> = connections.db.model<IEmployeeModel>('EmployeeModel', employeeSchema);

export default EmployeeModel;