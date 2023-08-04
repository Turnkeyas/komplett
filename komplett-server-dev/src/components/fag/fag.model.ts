import { Model, Schema, Document, Types } from 'mongoose';
import * as connections from '../../config/connection/connection';

export interface IFagModel extends Document {
    id: number,
    description: string,
    hourlyRate: number
}


/**
 * @swagger
 * components:
 *  schemas:
 *    FagSchema:
 *      properties:
 *        id:
 *          type: number
 *        description:
 *          type: string
 *        hourlyRate:
 *          type: number
 *       
 */
const FagSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    hourlyRate: {
        type: Number,
        default: 0
    },
    isDefault: {
        type: Boolean,
        default: true
    }
}, {
    collection: 'Fags',
    timestamps: true
});

const FagModel: Model<IFagModel> = connections.db.model<IFagModel>('FagModel', FagSchema);

export default FagModel;