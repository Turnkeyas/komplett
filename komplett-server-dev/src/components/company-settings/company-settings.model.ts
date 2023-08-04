import { string } from 'joi';
import { Document, Model, Schema, Types } from 'mongoose';
import * as connections from '../../config/connection/connection';

export interface ICompanySettingsModel extends Document {
    userId: String,
    netSalary: Number,
    socialExpenses: Number,
    employersTax: Number,
    operatingCosts: Number,
    totalCostPerHour: Number,
    valueAddedTax: number,
    valueIncrease: Number,
    surchargeMaterial: number,
    surchargeWork: number
}


export const defaultCompanySettings: any = {
    netSalary: 0,
    socialExpenses: 0,
    employersTax: 0,
    operatingCosts: 0,
    totalCostPerHour: 0,
    valueAddedTax: 0,
    valueIncrease: 0,
    surchargeMaterial: 0,
    surchargeWork: 0
}


/**
 * @swagger
 * components:
 *  schemas:
 *    CompanySettingsSchema:
 *      properties:
 *        userId:
 *          type: string
 *        netSalary:
 *          type: number
 *        socialExpenses:
 *          type: number
 *        employersTax:
 *          type: number
 *        operatingCosts:
 *          type: number
 *        totalCostPerHour:
 *          type: number
 *        valueAddedTax:
 *          type: number
 *        valueIncrease:
 *          type: number
 *        surchargeMaterial:
 *          type: number
 *        surchargeWork:
 *          type: number
 *       
 */
const CompanySettingsSchema: Schema = new Schema({
    userId: {
        type: Types.ObjectId,
        unique: true
    },
    netSalary: Number,
    socialExpenses: Number,
    employersTax: Number,
    operatingCosts: Number,
    totalCostPerHour: Number,
    valueAddedTax: Number,
    valueIncrease: Number,
    surchargeMaterial: Number,
    surchargeWork: Number
}, {
    collection: 'CompanySettings',
    timestamps: true
});

const CompanySettingsModel: Model<ICompanySettingsModel> = connections.db.model<ICompanySettingsModel>('CompanySettingsModel', CompanySettingsSchema);
export default CompanySettingsModel;