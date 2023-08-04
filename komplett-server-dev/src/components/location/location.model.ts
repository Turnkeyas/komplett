import {  Document, Schema, Types } from 'mongoose';
import * as connections from '../../config/connection/connection';

export interface ILocationModel extends Document {
    createdAt?: Date;
    updatedAt?: Date;
    name?: string;
    formattedAddress?: string;
    route?: string;
    country?: string;
    state?: string;
    city?: string;
    street?: string;
    postCode?: string;
    latitude?: string;
    longitude?: string;
    floor?: string;
    department?: string;
    stateCode?: string;
    countryCode?: string;
}

/**
 * @swagger
 * components:
 *  schemas:
 *    LocationSchema:
 *      properties:
 *        name:
 *          type: string
 *        street:
 *          type: string
 *        city:
 *          type: string
 *        state:
 *          type: string
 *        stateCode:
 *          type: string
 *        country:
 *          type: string
 *        countryCode:
 *          type: string
 *        postCode:
 *          type: string
 *        formattedAddress:
 *          type: string
 *        latitude:
 *          type: number
 *        longitude:
 *          type: number
 */
const locationsSchema = new Schema({
    name: String,
    street: String,
    route: String,
    city: String,
    state: String,
    stateCode: String,
    country: String,
    countryCode: String,
    postCode: String,
    formattedAddress: String,
    latitude: Number,
    longitude: Number
} , {
    collection : 'Locations',
    timestamps : true
});

const LocationModel = connections.db.model<ILocationModel>('LocationModel', locationsSchema);
export default LocationModel;
