import { Model, Types } from "mongoose";
import DAO, { paginationConfig } from "../dao";
import locationDao from "../location/location.dao";
import { ILocationModel } from "../location/location.model";
import UserService from "../user/user.dao";
import userModel from "../user/user.model";
import EmployeeModel, { IEmployeeModel } from "./employee.model";
import { USERROLES } from "../../constants/constants";

class EmployeeDAO extends DAO {
    model: Model<any> = EmployeeModel;
    lookupUser = {
        $lookup: {
            from: 'usermodel',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
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
    // employee is deleted if user.active is flase
    userActiveFilter = {
        $match: {
            "user.active": true
        }
    }

    findAllEmployee = async (config: paginationConfig) => {
        try {
            const result = await this.fnGetByConfigration({ ...config, lookupAggregate: [this.lookupUser, this.lookupLocation, this.userActiveFilter] });
            return result;
        } catch (error) {
            throw new Error(error)
        }
    }

    findEmployeeById = async (id: string) => {
        try {
            const employeeId = Types.ObjectId(id);
            let aggregation = [];
            const match = {
                $match: {
                    _id: employeeId,
                },
            }

            aggregation.push(match, this.lookupUser, this.lookupLocation, this.userActiveFilter);
            const employee = await this.model.aggregate(aggregation);
            return employee;
        } catch (error) {
            throw new Error(error)
        }
    }


    insertEmployee = async (data: any) => {
        try {
            const user = data.user;
            const location = data.location;
            if (user) {
                //TODO : user validation for email and name
                user.role = USERROLES.EMPLOYEE;
                const userDoc = await UserService.insert(user);
                data.userId = userDoc._id;
            }
            if (location) {
                const locationDoc: ILocationModel = await locationDao.insert<ILocationModel>(location);
                data.locationId = locationDoc._id;
            }
            const doc = await this.insert(data);
            return doc;
        } catch (error) {
            throw new Error(error)
        }
    }


    updateEmployee = async (data: any) => {
        try {
            const location = data.location;
            const user = data.user;
            if (location) {
                if (!location._id) { throw new Error('_id not available in "data.location"') };
                const locationDoc = await locationDao.update(data.location._id, location);
            }
            if (user) {
                if (!user._id) { throw new Error('_id not available in "data.user"') };
                const userDoc = await UserService.update(user);
            }
            const result = await this.model.findByIdAndUpdate(data._id, { $set: data });
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    deleteEmployee = async (id: string) => {
        try {
            const doc = await this.fnGet<IEmployeeModel>(id);
            let user;
            if (doc && doc.userId) {
                user = await userModel.findByIdAndUpdate({ _id: doc.userId }, { $set: { active: false } });
            } else {
                throw new Error("userId not available in employee doc");
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default new EmployeeDAO();