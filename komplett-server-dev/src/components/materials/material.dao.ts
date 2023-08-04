import { Aggregate, Types } from "mongoose";
import {
  IInsertSubMaterial,
  ISectionModel,
  IMaterialModel,
  SectionModel,
  MaterialModel,
  tabTypes,
  divisionTypes,
} from "./material.model";
import { IMaterialService } from "./material.interface";
import { insertSubMaterial, updateSubMaterial } from "./material.controller";
import { MasterMaterialModel } from "../master-material/master-material.model";
import { update } from "lodash";

const MaterialService: IMaterialService = {
  async findAll(
    page: number,
    limit: number,
    order?: Number,
    type?: string,
    sorting?: string,
    division?: string
  ): Promise<ISectionModel[]> {
    const skip = (page - 1) * limit;

    try {
      let aggregation = [];

      // let facett = {
      //   $facet: {
      //     divisions: [{ $match: {type: type,  division: { $exists: true } } },],
      //     without:[{$match: {type: type,  division: { $exists: false} } }]
      //   },
      // };
      // aggregation.push(facett);

      if (type && type in tabTypes) {
        let match = {
          $match: { type: type },
        };
        aggregation.push(match);
      }

      if (division && division in divisionTypes) {
        let match = {
          $match: { division: division },
        };
        aggregation.push(match);
      }

      let sort = sorting
        ? { $sort: { [sorting]: order } }
        : { $sort: { _id: order } };

      let lookup = {
        $lookup: {
          from: "SubMaterials",
          localField: "subMaterials",
          foreignField: "_id",
          as: "subMaterials",
        },
      };

      const unwindSubMaterials = {
        $unwind: {
          path: "$subMaterials",
          preserveNullAndEmptyArrays: true,
        },
      };

      const lookupFag = {
        $lookup: {
          from: "Fags",
          localField: "subMaterials.subject",
          foreignField: "_id",
          as: "subMaterials.subjectDoc",
        },
      };

      const unwindSubject = {
        $unwind: {
          path: "$subMaterials.subjectDoc",
          preserveNullAndEmptyArrays: true,
        },
      };

      // FIXME - add $first here whenever change model
      const group = {
        $group: {
          _id: "$_id",
          quantity: { $first: "$quantity" },
          unit: { $first: "$unit" },
          buildingComponents: { $first: "$buildingComponents" },
          code: { $first: "$code" },
          level: { $first: "$level" },
          division: { $first: "$division" },
          order: { $first: "$order" },
          type: { $first: "$type" },
          description: { $first: "$description" },
          subMaterials: { $push: "$subMaterials" },
          index: { $first: "$index" },
        },
      };

      let facet = {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: page } }],
          data: [{ $skip: skip }, { $limit: limit }], // add projection here wish you re-shape the docs
        },
      };

      aggregation.push(
        lookup,
        unwindSubMaterials,
        lookupFag,
        unwindSubject,
        group,
        sort,
        facet
      );
      let result = await SectionModel.aggregate(aggregation);
      const response = result[0];

      response.data.forEach((e: any, index: number) => {
        let res = e.subMaterials.filter((o: any): any => {
          return Object.keys(o).length !== 0;
        });
        response.data[index].subMaterials = res;
      });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async insert(body: ISectionModel): Promise<ISectionModel> {
    try {
      const doc: ISectionModel = await SectionModel.create(body);
      return doc;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async insertWithSubMaterials(body: any): Promise<ISectionModel> {
    try {
      let subMaterials = body.subMaterials;
      const copiedSubMaterialsArray: Array<Types.ObjectId | string> = [];
      await Promise.all(
        subMaterials.map(async (element: any) => {
          let elemId = element;
          try {
            let doc: any;
            if (body.isDuplicate) {
              doc = await MaterialModel.findById(element).lean();
            } else {
              doc = await MasterMaterialModel.findById(elemId).lean();
              // copy properties and insert in submaterial table
              // fetch id of newly created submaterials replace sub material array with
              // copiedSubMaterialsArray
              if (!doc) {
                throw new Error(
                  `master material with id - ${elemId} is not available`
                );
              }
               doc.masterMaterialId = doc["_id"];
            }
            delete doc["_id"];

            if (!doc.subject || !Types.ObjectId.isValid(doc.subject)) {
              delete doc.subject;
            }

            const newDoc = await MaterialModel.create(doc);
            copiedSubMaterialsArray.push(newDoc._id);
          } catch (error) {
            throw new Error(error);
          }
        })
      );
      if (body.isDuplicate) {
        delete body.isDuplicate;
      }
      body.subMaterials = copiedSubMaterialsArray;

      //increnment order number
      const lastDoc: ISectionModel = await SectionModel.findOne({
        type: body.type,
        division: body.division,
      })
        .sort({ order: -1 })
        .limit(1);
      console.log("lastDoc", lastDoc);
      body.order = lastDoc ? lastDoc.order + 1 : 1;

      const newMaterialDoc = await SectionModel.create(body);

      return newMaterialDoc;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async pushInSubMaterials(body: any): Promise<ISectionModel> {
    try {
      const subMaterials = body.subMaterials;
      const materialId = body.materialId;

      const copiedSubMaterialsArray: Array<Types.ObjectId | string> = [];

      await Promise.all(
        subMaterials.map(async (element: any) => {
          try {
            let doc = await MasterMaterialModel.findById(element).lean();
            // copy properties and insert in submaterial table
            // fetch id of newly created submaterials replace sub material array with
            // copiedSubMaterialsArray
            if (!doc) {
              throw new Error(
                `master material with id - ${element} is not available`
              );
            }
            doc.masterMaterialId = doc["_id"];
            delete doc["_id"];
            const newDoc = await MaterialModel.create(doc); // create submaterial table
            copiedSubMaterialsArray.push(newDoc._id); //push in matrail tabel
          } catch (error) {
            throw new Error(error);
          }
        })
      );

      const result = await SectionModel.update(
        // material table(section)
        { _id: materialId }, // section ID
        { $push: { subMaterials: copiedSubMaterialsArray } }
      );

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async remove(id: string): Promise<ISectionModel> {
    try {
      const doc = await SectionModel.findById(id);
      if (!doc) {
        throw new Error("Doc with this id not found");
      }
      doc.remove();
      return doc;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async update(body: ISectionModel): Promise<ISectionModel> {
    try {
      const oldDoc = await SectionModel.findById(body._id);
      if (body.division && oldDoc.division !== body.division) {
        const lastDoc: ISectionModel = await SectionModel.findOne({
          type: oldDoc.type,
          division: body.division,
        })
          .sort({ order: -1 })
          .limit(1);
        body.order = lastDoc ? lastDoc.order + 1 : 1;
      }
      const doc: ISectionModel = await SectionModel.findByIdAndUpdate(
        { _id: Types.ObjectId(body._id) },
        { $set: body }
      );
      return doc;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // DONE
  async insetSubMaterial(body: IInsertSubMaterial): Promise<IMaterialModel> {
    try {
      // delete body.materialId;
      const doc: IMaterialModel = await MaterialModel.create(body);
      SectionModel.update(
        { _id: body.materialId },
        { $push: { subMaterials: doc._id } }
      ).then((res) => { });

      return doc;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // DONE
  async findSubMaterial(materialId: string): Promise<any> {
    try {
      let lookup = {
        $lookup: {
          from: "SubMaterials",
          localField: "subMaterials",
          foreignField: "_id",
          as: "subMaterials",
        },
      };

      const unwindSubMaterials = {
        $unwind: {
          path: "$subMaterials",
        },
      };

      const lookupFag = {
        $lookup: {
          from: "Fags",
          localField: "subMaterials.subject",
          foreignField: "_id",
          as: "subMaterials.subjectDoc",
        },
      };

      const unwindSubject = {
        $unwind: {
          path: "$subMaterials.subjectDoc",
        },
      };

      const group = {
        $group: {
          _id: "$_id",
          subMaterials: { $push: "$subMaterials" },
        },
      };

      let match = { $match: { _id: Types.ObjectId(materialId) } };
      const subMaterials = SectionModel.aggregate([
        match,
        lookup,
        unwindSubMaterials,
        lookupFag,
        unwindSubject,
        group,
        { $project: { subMaterials: 1 } },
      ]);
      return subMaterials;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // DONE
  async updateSubMaterial(body: IMaterialModel): Promise<IMaterialModel> {
    try {
      const doc = MaterialModel.findByIdAndUpdate(body._id, { $set: body });
      return doc;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async removeSubMaterial(id: string): Promise<IMaterialModel> {
    try {
      const doc: IMaterialModel = await MaterialModel.findById(id);
      if (!doc) {
        throw new Error("Doc with this id not found");
      }
      doc.remove();
      return doc;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async clearAllQuantity(): Promise<ISectionModel> {
    try {
      const doc: ISectionModel = await SectionModel.updateMany(
        {},
        { quantity: 0 }
      );
      if (!doc) {
        throw new Error("Doc with this id not found");
      }
      return doc;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async reorderData(body): Promise<any> {
    const from = body.from;
    const to = body.to;
    const type = body.type;
    const division = body.division ? body.division : "";
    let doc: any;
    try {
      if (from.order > to) {
        const query = division
          ? { order: { $gte: to, $lt: from.order }, type, division }
          : { order: { $gte: to, $lt: from.order }, type };
        const test = await SectionModel.updateMany(
          query, //Your Condition
          { $inc: { order: 1 } } //YOUR JSON contents
        );
        console.log("increment", test);
      } else {
        console.log("decrement");
        const query = division
          ? { order: { $lte: to, $gt: from.order }, type, division }
          : { order: { $lte: to, $gt: from.order }, type };
        await SectionModel.updateMany(
          query, //Your Condition
          { $inc: { order: -1 } } //YOUR JSON contents
        );
      }
      doc = await SectionModel.updateOne(
        { _id: Types.ObjectId(from.id) },
        { $set: { order: to } }
      );
      return "Reorder done";
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default MaterialService;
