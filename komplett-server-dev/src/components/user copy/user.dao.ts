import * as Joi from 'joi';
import UserModel, { IUserModel } from './user.model';
import UserValidation from './user.validation';
import { IUserService } from './user.interface';
import { Types } from 'mongoose';
import { MongoError } from 'mongodb';
/**
 * @export
 * @implements {IUserModelService}
 */
const UserService: IUserService = {
    /**
     * @returns {Promise < IUserModel[] >}
     * @memberof UserService
     */
    async findAll(): Promise<IUserModel[]> {
        try {
            return await UserModel.find({});
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {string} id
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async findOne(id: string): Promise<IUserModel> {
        try {
            return await UserModel.findOne({
                _id: Types.ObjectId(id)
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    /**
     * @param {IUserModel} user
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async insert(body: IUserModel): Promise<IUserModel> {
        try {
            const user: IUserModel = await UserModel.create(body);
            return user;
        } catch (error) {
            if (error instanceof MongoError) {
                throw new Error('User with email id already exists');
            }
            throw new Error(error.message);
        }
    },

    /**
     * @param {string} id
     * @returns {Promise < IUserModel >}
     * @memberof UserService
     */
    async remove(id: string): Promise<IUserModel> {
        try {
            const user: IUserModel = await UserModel.findOneAndRemove({
                _id: Types.ObjectId(id)
            });
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    },


    /**
    * @param {IUserModel} user
    * @returns {Promise < any >}
    * @memberof UserService
    */
    async update(body: any): Promise<IUserModel> {
        try {
            const user: IUserModel = await UserModel.findByIdAndUpdate({ _id: Types.ObjectId(body._id) }, { $set: body });
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

export default UserService;
