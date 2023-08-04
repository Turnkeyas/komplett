import { Document, Schema, Types } from 'mongoose';
import * as connections from '../../config/connection/connection';
import { ILocationModel } from '../location/location.model';
import userModel from '../user/user.model';


export interface ICustomerModel extends Document {
    //user id refere to user id
    userId: String;
    locationId: String;
    contactPerson: String;
    customerType: String;
    contactPersonNumber: String;
    organizationNumber: String;
    contactPersonEmail: String;
}


/**
 * @swagger
 * components:
 *  schemas:
 *    CustomerSchema:
 *      properties:
 *        userId:
 *          type: string
 *        contactPerson:
 *          type: string
 *        customerType:
 *          type: string
 *        contactPersonNumber:
 *          type: string
 *        organizationNumber:
 *          type: string
 *        contactPersonEmail:
 *          type: string
 *        locationId:
 *          type: string
 *        location:
 *          type: object  
 *          $ref : '#/components/schemas/LocationSchema'
 *        user:
 *          $ref : '#/components/schemas/UserSchema' 
 *    
 */
const CustomerSchema: Schema = new Schema({
    contactPerson: String,
    customerType: String,
    contactPersonNumber: String,
    organizationNumber: String,
    contactPersonEmail: String,
   
    //relations
    userId: {
        type: Types.ObjectId,
        ref: 'UserModel'
    },
    locationId: {
        type: Types.ObjectId,
        ref: 'LocationModel'
    }
}, {
    collection: 'Customers',
    timestamps: true
})


// on save customer also update customerId field in user table
CustomerSchema.pre('save', async function (next) {
    try {
        const self: any = this;
        if (self.userId) {
            const user = await userModel.findByIdAndUpdate({ _id: Types.ObjectId(self.userId) }, { customerId: self._id });
        }
        next();
    } catch (error) {
        throw new Error(error);
    }
})

// deactive from user table so he can not login 
CustomerSchema.pre('remove', async function (next) {
    //FIXME : is there any login after removing customer
});


export default connections.db.model<ICustomerModel>('CustomerModel', CustomerSchema);

