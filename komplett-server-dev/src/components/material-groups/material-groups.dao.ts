import { Model, Types } from "mongoose";
import { MongoError } from "mongodb";
import {
  MaterialGroupsModel,
  SubgroupsModel,
  IGroupModel,
} from "./material-groups.model";
import DAO from "../dao";

class MaterialGroupsDAO extends DAO {
  model: Model<IGroupModel> = MaterialGroupsModel;

  getAll = async (queryParmas: any): Promise<IGroupModel[]> => {
    try {
      let docs: IGroupModel[];
      if (queryParmas && Object.keys(queryParmas).length) {
        if (queryParmas.category === "all") {
          docs = await this.model.find().populate("subgroups"); // link subgroup table via assign model
        } else {
          docs = await this.model.find(queryParmas).populate("subgroups");
        }
      }

      return docs;
    } catch (error) {
      throw new Error(error);
    }
  };

  // addSubgroupRecord = async (
  //   payloads: ISubgroupModel
  // ): Promise<ISubgroupModel> => {
  //   try {
  //     console.log("payloads", payloads);
  //     // const obj = new this.model(body);
  //     const doc: ISubgroupModel = await SubgroupsModel.create(payloads);
  //     console.log("doc", doc);
  //     if (!doc) {
  //       throw new Error("Subgroup create failed");
  //     }
  //     return doc;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // };
}

export default new MaterialGroupsDAO();
