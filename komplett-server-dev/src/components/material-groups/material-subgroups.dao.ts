import { Model, Types } from "mongoose";
import { MongoError } from "mongodb";
import {
  MaterialGroupsModel,
  SubgroupsModel,
  IGroupModel,
  ISubgroupModel,
} from "./material-groups.model";
import DAO from "../dao";

class MaterialSubgroupsDAO extends DAO {
  model: Model<ISubgroupModel> = SubgroupsModel;
  
  addSubgroupRecord = async (
    payloads: ISubgroupModel
  ): Promise<ISubgroupModel> => {
    try {
      console.log("payloads", payloads);
      // const obj = new this.model(body);
      const doc: ISubgroupModel = await SubgroupsModel.create(payloads);
      console.log("doc", doc);
      if (!doc) {
        throw new Error("Subgroup create failed");
      }
      return doc;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  deleteSubgroupRecord = async (
    id: any
  ): Promise<ISubgroupModel> => {
    try {
      console.log("payloads", id);
      // const obj = new this.model(body);
      const doc: ISubgroupModel = await SubgroupsModel.findOneAndDelete({"_id": id});
      console.log("doc", doc);
      if (!doc) {
        throw new Error("Subgroup create failed");
      }
      return doc;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default new MaterialSubgroupsDAO();
