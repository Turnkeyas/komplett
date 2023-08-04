import { Model } from "mongoose";
import DAO from "../dao";
import { IFagModel } from "./fag.model";
import FagModel from './fag.model';
class FagDAO extends DAO {
    model: Model<IFagModel> = FagModel;

    getAllFags = async () => {
        try {
            const aggregate = [];
            const sortAggregate = {
                $sort: {
                    id: 1
                }
            }

            aggregate.push(sortAggregate);

            const docs = await this.model.aggregate(aggregate);
            console.log(docs);
            return docs;
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default new FagDAO()