import * as Joi from 'joi';
import Validation from '../validation';
import { ICustomerModel } from './customer.model';


class CustomerValidation extends Validation {
    constructor() {
        super();
    }

    insertCustomerValidation(body: object): Joi.ValidationResult<any> {
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

    findCustomerByIdValidation(param: {
        id: string
    }): Joi.ValidationResult<any> {
        const schema: Joi.Schema = Joi.object().keys({
            id: this.customJoi.objectId().required()
        });
        return Joi.validate(param, schema);
    }

    updateCustomerValidation(body: object): Joi.ValidationResult<any> {
        const schema: Joi.Schema = Joi.object().keys({
            _id: this.customJoi.objectId().required()
        });
        return Joi.validate(body, schema ,{allowUnknown : true});
    }
}

export default new CustomerValidation();