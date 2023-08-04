import { Mongoose, Schema, Document, Types } from "mongoose";
import * as connections from "../../config/connection/connection";

export enum tabTypes {
  "Engineering",
  "ContainerRent",
  "CoveringAndDemolition",
  "Carpentry",
  "Membraneworker",
  "WallPlasterAndTileWork",
  "RorarBeider", //plumbing
  "Electricalwork",
  "Tømrerarbeider",
  "Coverage",
  "Demolition",
}

export enum divisionTypes {
  "Bath",
  "LaundryRoom",
  "WC",
  "Kitchen",
  "BedRoom",
  "LivingRoom",
  "Bod",
}

// FIXME : change findAll method in material.dao
// whenever there is a change in ISectionModel
export interface ISectionModel extends Document {
  quantity: number;
  unit: String;
  buildingComponents: String;
  code: String;
  level: String;
  type: String;
  division: String;
  subMaterials: Array<Types.ObjectId>;
  order: number;
  description: String;
}

export interface IMaterialModel extends Document {
  subject: string;
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
  time: any;
}

export interface IInsertSubMaterial extends IMaterialModel {
  materialId: String;
}

/**
 * @swagger
 * components:
 *  schemas:
 *    MaterialSchema:
 *      properties:
 *        quantity:
 *          type: number
 *        unit:
 *          type: string
 *        buildingComponents:
 *          type: string
 *        code:
 *          type: string
 *        level:
 *          type: string
 *        type:
 *          type: string
 *        subMaterials:
 *          type: array
 *          example: []
 *          items:
 *            $ref : '#/components/schemas/SubMaterialSchema'
 */

// FIXME : change findAll method in material.dao
// whenever there is a change in ISectionModel
const SectionSchema: Schema = new Schema(
  {
    quantity: {
      type: Number,
    },
    unit: {
      type: String,
    },
    buildingComponents: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
    level: {
      type: String,
    },
    type: {
      type: String,
    },
    division: {
      type: String,
    },
    index: {
      type: Number,
    },
    order:{
      type: Number,
    },
    subMaterials: {
      type: [{ type: Types.ObjectId, ref: "SubMaterialModel" }],
      default: [],
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

SectionSchema.post("remove", async function (doc) {
  const self = this;
  self.subMaterials.forEach(async (submaterial: Types.ObjectId) => {
    const doc = await MaterialModel.remove({ _id: submaterial });
  });
});

const applicationDefaultUnits = [
  { symbol: "lm", name: "lopemeter" },
  { symbol: "stk", name: "stykk" },
  { symbol: "m2", name: "kvadratmeter" },
  { symbol: "RS", name: "rundsum" },
];

/**
 * @swagger
 * components:
 *  schemas:
 *    SubMaterialSchema:
 *      properties:
 *        subject:
 *          type: string
 *        NS3420:
 *          type: string
 *        application:
 *          type: string
 *        crowd:
 *          type: number
 *        unit:
 *          type: string
 *        itemPrice:
 *          type: number
 *        itemFactor:
 *          type: number
 *        inverseFactor:
 *          type: number
 *        useListPrice:
 *          type: number
 *        documents:
 *          type: array
 *          items:
 *            type: object
 *        quantity:
 *          type: object
 *          properties:
 *            type:
 *              type: string
 *            quantityPerComponent:
 *              type: number
 *            svinn:
 *              type: number
 *            inTotal:
 *              type: number
 *        time:
 *          type: object
 *          properties:
 *            minPerComponent:
 *              type: number
 *            hoursPerComponent:
 *              type: number
 *            totalTimeConsumption:
 *              type: string
 *
 */
const MaterialSchema: Schema = new Schema({
  subject: {
    type: Types.ObjectId,
    ref: "FagModel",
    // required: true
  },
  // subject: String,
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
  masterMaterialId: Types.ObjectId,
  useListPrice: {
    type: Number,
    default: 0,
  },
  documents: {
    type: [{ name: String, url: String }],
    default: [
      {
        name: "FDV",
        url:
          "https://export.byggtjeneste.no/api/media/2dd67cb0-9eef-4b62-95d5-56455d4d5cca?download=false",
      },
    ],
  },
  fdvDocument: {
    type: String,
  },
  quantity: {
    type: {
      type: String,
      default: "usual",
    },
    quantityPerComponent: Number,
    svinn: {
      type: Number,
      default: 20,
    },
    inTotal: Number,
  },
  time: {
    minPerComponent: Number,
    hoursPerComponent: Number,
    totalTimeConsumption: String,
  },
});
// to update svinn to 20
// db.SubMaterials.updateMany({} , {$set: {"quantity.svinn" : 20}})

MaterialSchema.post("remove", async (doc, next) => {
  try {
    const submaterialId = doc._id;
    const docr = await SectionModel.find({
      subMaterials: { $in: submaterialId },
    });
    await docr[0].update({
      $pull: {
        subMaterials: submaterialId,
      },
    });
    next();
  } catch (error) {
    throw new Error(error);
  }
});

let MaterialModel = connections.db.model<IMaterialModel>(
  "SubMaterialModel",
  MaterialSchema,
  "SubMaterials"
);

let SectionModel = connections.db.model<ISectionModel>(
  "MaterialModel",
  SectionSchema,
  "Materials"
);
export { SectionModel, MaterialModel };
