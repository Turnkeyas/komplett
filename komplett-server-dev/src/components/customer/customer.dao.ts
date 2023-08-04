import { use } from "chai";
import { Model, Types } from "mongoose";
import { couldStartTrivia } from "typescript";
import { USERROLES } from "../../constants/constants";
import DAO from "../dao";
import locationDao from "../location/location.dao";
import LocationDAO from "../location/location.dao";
import { ILocationModel } from "../location/location.model";
import UserService from "../user/user.dao";
import userModel from "../user/user.model";
import CustomerModel, { ICustomerModel } from './customer.model';

class CustomerDAO extends DAO {
    model: Model<ICustomerModel> = CustomerModel;
    lookupUser = {
        $lookup: {
            from: 'usermodel',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
        }
    };
    lookupLocation = {
        $lookup: {
            from: 'Locations',
            localField: 'locationId',
            foreignField: '_id',
            as: 'location'
        }
    };

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
    userActiveFilter = {
        $match: {
            "user.active": true
        }
    }

    insertCustomer = async (data: any) => {
        try {
            // create user account of customer
            const user = data.user;
            const location = data.location;
            if (user) {
                user.role = USERROLES.CUSTOMER;
                delete user._id;
                const userDoc = await UserService.insert(user);
                data.userId = userDoc._id;
            }

            // set location ref from location Table
            if (location) {
                delete location._id;
                const locationDoc = await LocationDAO.insert<ILocationModel>(location);
                data.locationId = locationDoc._id;
            }

            const customer = await this.model.create(data);

            return customer;
        } catch (error) {
            throw new Error(error);
        }
    }

    // findCustomerByName = async (name: string) => {
    //     try {
    //         const regEx = new RegExp(`${name}`, 'i');
    //         const matchAggregate = { $match: { 'user.name': regEx } };

    //         const facet = {
    //             '$facet': {
    //                 metadata: [{ $count: "total" }],
    //                 data: [{ $skip: 0 }]
    //             }
    //         };
    //         const result: any = await this.model.aggregate([this.lookupUser, this.lookupLocation, this.unwindUser, matchAggregate, facet]);
    //         return result[0];
    //     } catch (error) {
    //         throw new Error(error);
    //     }
    // }


    findAllCustomer = async (config: any) => {
        try {
            let result;
            if (config.customerName) {
                const regEx = new RegExp(`${config.customerName}`, 'i');
                const CustomerNameMatchAggregate = { $match: { 'user.name': regEx } };
                result = this.fnGetByConfigration({ ...config, lookupAggregate: [this.lookupUser, this.lookupLocation, this.unwindUser, this.unwindLocation, CustomerNameMatchAggregate, this.userActiveFilter] });
            } else {
                result = this.fnGetByConfigration({ ...config, lookupAggregate: [this.lookupUser, this.lookupLocation, this.unwindUser, this.unwindLocation, this.userActiveFilter] });
            }
            return result;
        } catch (error) {
            throw new Error(error)
        }
    }

    findCustomerById = async (id: string) => {
        try {
            const customerId = Types.ObjectId(id);
            let aggregation = [];
            const match = {
                $match: {
                    _id: customerId
                }
            }

            aggregation.push(match, this.lookupUser, this.lookupLocation, this.unwindUser, this.unwindLocation);
            const customer = this.model.aggregate(aggregation);
            return customer;
        } catch (error) {
            throw new Error(error);
        }
    }

    updateCustomer = async (data: any) => {
        try {
            //NOTE: if updated email id from user table then credentails of customer 
            // login are changes so making it not updatable
            // only admin can update email of customer
            if (data.user) {
                if (!data.user._id) { throw new Error('_id not available in "data.user"') }
                const user = await UserService.update(data.user);
            }

            //update location in location table
            if (data.location) {
                if (!data.location._id) { throw new Error('_id not available in "data.location"') }
                const location = await locationDao.update(data.location._id, data.location);
            }
            const result = this.model.findByIdAndUpdate(data._id, { $set: data });
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }


    // NOTE we just want to disable customer from login
    // can't delete all data of customer 
    // as projects has refrence of customer table
    deleteCustomer = async (id: string) => {
        try {
            const customer: ICustomerModel = await this.fnGet(id);
            let user;
            if (customer && customer.userId) {
                user = await userModel.findByIdAndUpdate({ _id: customer.userId }, { $set: { active: false } });
            } else {
                throw new Error("userId is not available in customers doc");
            }
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default new CustomerDAO();