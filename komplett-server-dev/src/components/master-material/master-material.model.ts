import { Schema, Types, Document } from "mongoose";
import * as connections from "../../config/connection/connection";

export interface IMasterMaterialModel extends Document {
  subject: String;
  NS3420: String;
  application: String;
  crowd: Number;
  unit: String;
  itemPrice: Number;
  itemFactor: Number;
  inverseFactor: Number;
  useListPrice: Number;
  documents: Array<any>;
  quantity: any;
  groupId: String;
  subgroupId: String;
  time: any;
}

const MasterSubMaterialSchema: Schema = new Schema(
  {
    subject: {
      type: Types.ObjectId,
      ref: "FagModel",
      // required: true
    },
    // subject: String,
    category: {
      type: String,
      required: true,
    },
    NS3420: String,
    application: {
      type: String,
      required: true,
    },
    crowd: Number,
    unit: String,
    itemPrice: Number,
    itemFactor: Number,
    inverseFactor: Number,
    useListPrice: {
      type: Number,
    },
    documents: {
      type: [{ name: String, url: String }],
    },
    fdvDocument: {
      type: String,
    },
    quantity: {
      type: {
        type: String,
      },
      quantityPerComponent: Number,
      svinn: Number,
      inTotal: Number,
    },
    groupId: {
      type: Types.ObjectId,
      ref: "MaterialGroupsModel",
    },
    subgroupId: {
      type: Types.ObjectId,
      ref: "SubgroupsModel",
    },
    time: {
      minPerComponent: Number,
      hoursPerComponent: Number,
      totalTimeConsumption: String,
    },
  },
  {
    collection: "MasterMaterials",
    timestamps: true,
  }
);

let MasterMaterialModel = connections.db.model<IMasterMaterialModel>(
  "MasterSubMaterialModel",
  MasterSubMaterialSchema
);

export { MasterMaterialModel };
