import * as Joi from "joi";
import UserModel, { IUserModel } from "./user.model";
import UserValidation from "./user.validation";
import { IUserService } from "./user.interface";
import { Types } from "mongoose";
import { MongoError } from "mongodb";
import { USERROLES } from "../../constants/constants";
import { query } from "winston";
import userModel from "./user.model";
/**
 * @export
 * @implements {IUserModelService}
 */
const UserService: IUserService = {
  /**
   * @returns {Promise < IUserModel[] >}
   * @memberof UserService
   */
  async findAll(config: any): Promise<any> {
    try {
      const aggregate = [];

      const order = config.order && config.order == "des" ? -1 : 1;
      const limit = config.limit;
      const page = config.page || 1;
      const sort = config.sort || "createdAt";
      const skipNumber = (page - 1) * limit;
      const role = config.role;

      const skipAggregate = { $skip: skipNumber };
      const sortAggregate = { $sort: { [sort]: order } };
      const limitAggregate = { $limit: limit };
      const matchCategory = {
        $match: {
          role: role,
        },
      };

      if (role !== "all" && role in USERROLES) {
        aggregate.push(matchCategory);
      }
      aggregate.push(sortAggregate);
      console.log(aggregate);

      if (limit) {
        const facet = {
          $facet: {
            metadata: [{ $count: "total" }, { $addFields: { page: page } }],
            data: [skipAggregate, limitAggregate],
          },
        };
        aggregate.push(facet);
      } else {
        const facet = {
          $facet: {
            metadata: [{ $count: "total" }, { $addFields: { page: page } }],
            data: [{ $skip: 0 }],
          },
        };
        aggregate.push(facet);
      }
      const docs = await userModel.aggregate(aggregate);
      return docs;

      // if (role && role in USERROLES) {
      //     aggregate.push(
      //         {
      //             $match: {
      //                 role: role
      //             }
      //         }
      //     )
      // } else {
      //     aggregate.push({
      //         $match: {
      //             role: {
      //                 $in: [USERROLES.ADMIN, USERROLES.SUPER_ADMIN, USERROLES.USER]
      //             }
      //         }
      //     })
      // }
      // console.log(aggregate);
      // const docs = await UserModel.aggregate(aggregate);
      // console.log(docs)
      // return docs;
      // return await UserModel.find({});
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
        _id: Types.ObjectId(id),
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
        throw new Error("User with email id already exists");
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
        _id: Types.ObjectId(id),
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
      await UserModel.updateOne(
        { _id: Types.ObjectId(body._id) },
        { $set: body }
      );
      const user: IUserModel = await UserModel.findById(body._id).lean();
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default UserService;
