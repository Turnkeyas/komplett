export interface FormStateModel {
    login: any;
    signup: any;
    subMaterial: any;
}

export const DefaultFormStateModel: FormStateModel = {
    login: {
        model: {},
        dirty: false,
        status: '',
        errors: {}
    },
    signup: {
        model: {},
        dirty: false,
        status: '',
        errors: {}
    },
    subMaterial: {
        model: {},
        dirty: false,
        status: '',
        errors: {}
    }
};
