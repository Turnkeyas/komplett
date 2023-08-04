import { ICompanySettingsModel, defaultCompanySettings } from "./company-settings.model";
import companySettingsDao from "./company-settings.dao";

export class CompanySettingsService {

    findCompanySettings = async (id: string): Promise<ICompanySettingsModel> => {
        try {
            // const companySetting: ICompanySettingsModel = await companySettingsDao.getCompanySettingByUserId(id);
            const companySetting: ICompanySettingsModel[] = await companySettingsDao.fnGetAll();
            /** 
             * id company setting is not available for user then create one with default object
             */
            if (!companySetting.length) {
                let obj = defaultCompanySettings;
                // obj.userId = id;                
                const doc: ICompanySettingsModel = await companySettingsDao.insert(obj);
                return doc;
            }
            return companySetting[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    insertCompanySettings = async (body: any): Promise<ICompanySettingsModel> => {
        try {
            const companySetting: ICompanySettingsModel = await companySettingsDao.insert(body);
            return companySetting;
        } catch (error) {
            throw new Error(error);
        }
    }

    updateCompanySettings = async (body: any): Promise<ICompanySettingsModel> => {
        try {
            const _id = body._id;
            const companySetting: ICompanySettingsModel = await companySettingsDao.update(body._id, body);
            return companySetting;
        } catch (error) {
            throw new Error(error);
        }
    }

    deleteCompanySettings = async (body: any): Promise<ICompanySettingsModel> => {
        try {
            const companySetting: ICompanySettingsModel = await companySettingsDao.deleteRecord(body);
            return companySetting;
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default new CompanySettingsService();