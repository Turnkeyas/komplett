import { Schema, Types, Document } from "mongoose";
import * as connections from '../../config/connection/connection';


export interface IOfferTemplateModel extends Document {
    title: string,
    value: string,
    surchargeMaterials: number,
    surchargeWorks: number
}



/**
 * @swagger
 * components:
 *  schemas:
 *    OfferTemplateSchema:
 *      properties:
 *        title:
 *          type: string
 *        value:
 *          type: string
 *        surchargeMaterials:
 *          type: number
 *        surchargeWorks:
 *          type: number
 *  
 */
const OfferTemplateSchema: Schema = new Schema({
    title: String,
    value: String,
    surchargeMaterials: Number,
    surchargeWorks: Number
}, {
    collection: 'OfferTemplates',
    timestamps: true
});


const OfferTemplateModel = connections.db.model<IOfferTemplateModel>('OfferTemplateModel', OfferTemplateSchema);

export {
    OfferTemplateModel
}