import * as Joi from "joi";
import Validation from "../validation";
import { IGroupModel } from "./material-groups.model";

/**
 * @export
 * @class MaterialGroupsValidation
 * @extends Validation
 */
class MaterialGroupsValidation extends Validation {
  /**
   * Creates an instance of MaterialGroupsValidation.
   * @memberof MaterialGroupsValidation
   */
  constructor() {
    super();
  }

  /**
   * @param {IUserModel} params
   * @returns {Joi.ValidationResult<IUserModel >}
   * @memberof MaterialGroupsValidation
   */
  createGroup(params: IGroupModel): Joi.ValidationResult<IGroupModel> {
    const schema: Joi.Schema = Joi.object().keys({
      name: Joi.string().required(),
      category: Joi.string().required(),
    });

    return Joi.validate(params, schema, { allowUnknown: true });
  }
}

export default new MaterialGroupsValidation();
