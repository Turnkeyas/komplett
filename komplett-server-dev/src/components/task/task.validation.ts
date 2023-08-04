import Validation from "../validation";
import * as Joi from 'joi';

class TaskValidation extends Validation {
    constructor() {
        super();
    }

    insertTaskValidation(body: object): Joi.ValidationResult<any> {
        const schema = Joi.object().keys({
            projectId: this.customJoi.objectId().required()
        });
        return Joi.validate(body, schema, { allowUnknown: true })
    }
}

export default new TaskValidation();