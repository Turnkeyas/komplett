import * as Joi from "joi";
import Validation from "../validation";
import { IGroupModel, ISubgroupModel } from "./material-groups.model";

/**
 * @export
 * @class MaterialGroupsValidation
 * @extends Validation
 */
class MaterialSubgroupsValidation extends Validation {
  /**
   * Creates an instance of MaterialGroupsValidation.
   * @memberof MaterialGroupsValidation
   */
  constructor() {
    super();
  }

  /**
   * @param {ISubgroupModel} params
   * @returns {Joi.ValidationResult<ISubgroupModel>}
   * @memberof MaterialGroupsValidation
   */
  createGroup(params: ISubgroupModel): Joi.ValidationResult<ISubgroupModel> {
    const schema: Joi.Schema = Joi.object().keys({
      name: Joi.string().required(),
      category: Joi.string().required(),
    });

    return Joi.validate(params, schema, { allowUnknown: true });
  }
}

export default new MaterialSubgroupsValidation();
