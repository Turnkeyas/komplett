import { Model, Types } from "mongoose";
import DAO from "../dao";
import CompanySettingsModel, { ICompanySettingsModel } from "./company-settings.model";

class CompanySettingsDAO extends DAO {
    model: Model<ICompanySettingsModel> = CompanySettingsModel;

    getCompanySettingByUserId = async (id: string): Promise<ICompanySettingsModel> => {
        try {
            const aggregate = [];
            aggregate.push(
                {
                    $match: {
                        userId:Types.ObjectId(id)
                    }
                }
            );
            const doc: ICompanySettingsModel[] = await this.model.aggregate(aggregate);
            return doc[0];
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default new CompanySettingsDAO();