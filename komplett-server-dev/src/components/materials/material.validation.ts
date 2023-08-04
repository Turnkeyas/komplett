import * as Joi from "joi";
import Validation from "../validation";
import { IInsertSubMaterial, IMaterialModel } from "./material.model";

class MaterialValidation extends Validation {
  constructor() {
    super();
  }

  /**
   * @param {{id:string}} body
   * @description need id of Material to find it's subMaterials
   */
  findSubMaterials(body: { id: string }): Joi.ValidationResult<{ id: string }> {
    const schema: Joi.Schema = Joi.object().keys({
      id: this.customJoi.objectId().required(),
    });
    return Joi.validate(body, schema);
  }

  insertSubMaterial(
    body: IInsertSubMaterial
  ): Joi.ValidationResult<IMaterialModel> {
    const schema: Joi.Schema = Joi.object().keys({
      materialId: this.customJoi.objectId().required(),
      // subject: this.customJoi.objectId().required()
    });
    return Joi.validate(body, schema, { allowUnknown: true });
  }

  updateSubMaterial(
    body: IMaterialModel
  ): Joi.ValidationResult<IMaterialModel> {
    const schema: Joi.Schema = Joi.object().keys({
      _id: this.customJoi.objectId().required(),
      // subject: this.customJoi.objectId().required()
    });

    return Joi.validate(body, schema, { allowUnknown: true });
  }
  reorderValidation(body: any): Joi.ValidationResult<any> {
    const schema = {
      type: Joi.string().required(),
    };
    return Joi.validate(body, schema, { allowUnknown: true });
  }

  // reorderValidation(body: any): Joi.ValidationResult<any> {

  //   var nestedSchema = Joi.object().keys({
  //       id: this.customJoi.objectId().required(),
  //       order: Joi.number().required(),
  //     });

  //   var schema: Joi.Schema = Joi.object().keys({type: Joi.string().required(), });
  //   // const schema = Joi.object().keys({
  //   //   from: nestedSchema,
  //   // //   to: Joi.number().required(),
  //   // //   type: Joi.string().required(),
  //   // //   division: Joi.string(),

  //   // });
  //   console.log('body', body)
  //   return Joi.validate(body, schema, { allowUnknown: true });
  // }
}

export default new MaterialValidation();
