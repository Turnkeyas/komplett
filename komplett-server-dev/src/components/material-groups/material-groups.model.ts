import { Document, Model, Schema, Types } from "mongoose";
import * as connections from "../../config/connection/connection";

const groupSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subgroups: {
      type: [{ type: Types.ObjectId, ref: "SubgroupsModel" }],
      default: [],
    },
  },
  {
    collection: "MaterialGroups",
    timestamps: true,
  }
);

/**
 * @export
 * @interface IGroupModel
 * @extends {Document}
 */
export interface IGroupModel extends Document {
  name: String;
  category: string;
}

export interface IGroupQueryModel {
  category: string;
}

const MaterialGroupsModel: Model<IGroupModel> = connections.db.model<IGroupModel>(
  "MaterialGroupsModel",
  groupSchema
);

const subGroupSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupId: {
      type: Types.ObjectId,
      ref: "MaterialGroupsModel",
      required: true,
    },
  },
  {
    collection: "Subgroups",
    timestamps: true,
  }
);

/**
 * @export
 * @interface ISubgroupModel
 * @extends {Document}
 */
export interface ISubgroupModel extends Document {
  name: String;
  groupId: String;
}

subGroupSchema.post("save", (subGroupObj: any, next: any) => {
  MaterialGroupsModel.findById({ _id: subGroupObj.groupId }).exec(
    (err: any, gObj: any) => {
      if (err) {
        console.error("subGroupSchema.post => save => Group.findById()", err);
      }
      if (gObj.subgroups.indexOf(subGroupObj._id) === -1) {
        gObj.subgroups.push(subGroupObj._id);
      }
      gObj.save((err: any) => {
        if (err) {
          console.error("subGroupSchema.post => save => groupObj.save()", err);
        }
      });
    }
  );
  next();
});

subGroupSchema.post("findOneAndDelete", (subGroupObj: any, next: any) => {
  MaterialGroupsModel.findById({ _id: subGroupObj.groupId }).exec(
    (err: any, gObj: any) => {
      if (err) {
        console.error(
          "subGroupSchema.post => findOneAndDelete => Group.findById()",
          err
        );
      }
      if (gObj.subgroups.indexOf(subGroupObj._id) > -1) {
        gObj.subgroups.pull(subGroupObj._id);
      }
      gObj.save((err: any) => {
        if (err) {
          console.error(
            "subGroupSchema.post => findOneAndDelete => groupObj.save()",
            err
          );
        }
      });
    }
  );
  next();
});

const SubgroupsModel: Model<ISubgroupModel> = connections.db.model<ISubgroupModel>(
  "SubgroupsModel",
  subGroupSchema
);

export { MaterialGroupsModel, SubgroupsModel };
