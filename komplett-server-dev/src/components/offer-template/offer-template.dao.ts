import { Model } from "mongoose";
import DAO from "../dao";
import { tabTypes } from "../materials/material.model";
import { IOfferTemplateModel, OfferTemplateModel } from './offer-template.model';

class OfferTemplateDAO extends DAO {
    model: Model<IOfferTemplateModel> = OfferTemplateModel;
}

export default new OfferTemplateDAO()