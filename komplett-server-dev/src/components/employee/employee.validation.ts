import Validation from "../validation";
import * as Joi from 'joi';

class EmployeeValidation extends Validation {
    updateEmployeeValidation(body: object): Joi.ValidationResult<any> {
        const schema: Joi.Schema = Joi.object().keys({
            _id: this.customJoi.objectId().required()
        });
        return Joi.validate(body, schema, { allowUnknown: true });
    }

    insertEmployeeValidation(body: object): Joi.ValidationResult<any> {
        const schema: Joi.Schema = Joi.object().keys({
            user: Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().email({
                    minDomainAtoms: 2
                }).required()
            })
        })
        return Joi.validate(body, schema, { allowUnknown: true });
    }
}

export default new EmployeeValidation();