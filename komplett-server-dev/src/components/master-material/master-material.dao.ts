import { Model, Types } from "mongoose";
import DAO from "../dao";
import { tabTypes } from "../materials/material.model";
import {
  IMasterMaterialModel,
  MasterMaterialModel,
} from "./master-material.model";
class MasterMaterialDAO extends DAO {
  model: Model<IMasterMaterialModel> = MasterMaterialModel;

  findMasterMaterialByCategory = async (config: any) => {
    try {
      let result;
      const aggregate = [];

      const order = config.order && config.order == "desc" ? -1 : 1;
      const limit = config.limit;
      const page = config.page || 1;
      const sort = config.sort || "createdAt";
      const skipNumber = (page - 1) * limit;
      const category = config.category;
      const groupId = config.groupId;

      const skipAggregate = { $skip: skipNumber };
      const sortAggregate = { $sort: { [sort]: order } };
      const limitAggregate = { $limit: limit };

      const matchCategory = {
        $match: {
          category: config.category,
        },
      };

      const lookupFag = {
        $lookup: {
          from: "Fags",
          localField: "subject",
          foreignField: "_id",
          as: "subjectDoc",
        },
      };
      const lookupGroup = {
        $lookup: {
          from: "MaterialGroups",
          localField: "groupId",
          foreignField: "_id",
          as: "groupDoc",
        },
      };

      const lookupSubgroup = {
        $lookup: {
          from: "Subgroups",
          localField: "subgroupId",
          foreignField: "_id",
          as: "subgroupDoc",
        },
      };
      const unwindFag = {
        $unwind: {
          path: "$subjectDoc",
          preserveNullAndEmptyArrays: true,
        },
      };
      const unwindGroup = {
        $unwind: {
          path: "$groupDoc",
          preserveNullAndEmptyArrays: true,
        },
      };

      const unwindSubgroup = {
        $unwind: {
          path: "$subgroupDoc",
          preserveNullAndEmptyArrays: true,
        },
      };

      if (category !== "all" && category in tabTypes) {
        aggregate.push(matchCategory);
      }

      if (groupId && groupId !== "all") {
        const matchGroup = {
          $match: {
            groupId: Types.ObjectId(config.groupId),
          },
        };
        aggregate.push(matchGroup);
      }
      aggregate.push(
        sortAggregate,  
        lookupFag,
        lookupGroup,
        lookupSubgroup,
        unwindFag,
        unwindGroup,
        unwindSubgroup
      );

    

      // as wee need all data for predictive search and limited data to show in table
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
      result = await this.model.aggregate(aggregate);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  };

  insertInMasterMaterial = async (data: any) => {
    try {
      const doc = await this.insert(data);
      return doc;
    } catch (error) {
      throw new Error(error);
    }
  };
}

export default new MasterMaterialDAO();
