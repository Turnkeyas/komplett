import { IFagModel } from "./fag.model";
import fagDao from "./fag.dao";
import { MaterialModel } from "../materials/material.model";
import { MasterMaterialModel } from "../master-material/master-material.model";

export class FagService {

    findFags = async (): Promise<IFagModel[]> => {
        try {
            const fags: IFagModel[] = await fagDao.getAllFags();
            return fags;
        } catch (error) {
            throw new Error(error);
        }
    }

    checkIsFagUsed = async (id: any): Promise<any> => {
        try {
            const checkMaterial = await MaterialModel.findOne({ subject: id });
            const checkMasterMaterial = await MasterMaterialModel.findOne({ subject: id });
            console.log(checkMaterial, checkMasterMaterial);
            if (!checkMasterMaterial && !checkMaterial) {
                return {
                    isUsed: false
                }
            }
            return { isUsed: true }
        } catch (error) {
            throw new Error(error);
        }
    }

    insertFag = async (body: IFagModel): Promise<IFagModel> => {
        try {
            const doc = await fagDao.insert<IFagModel>(body);
            return doc;
        } catch (error) {
            throw new Error(error);
        }
    }

    updateFag = async (body: IFagModel): Promise<IFagModel> => {
        try {
            const doc = await fagDao.update<IFagModel>(body._id, body);
            return doc;
        } catch (error) {
            throw new Error(error);
        }
    }

    deleteFag = async (id: string): Promise<IFagModel> => {
        try {
            const doc = await fagDao.deleteRecord<IFagModel>(id);
            return doc;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * replaces the fag in all materials
     * @param oldFagId 
     * @param newFagId 
     */
    replaceFag = async (oldFagId: string, newFagId: string): Promise<IFagModel> => {
        try {
            const docsFromMaterialModel = await MaterialModel.update({ subject: oldFagId }, { subject: newFagId });
            const docsFromMasterMaterialModel = await MasterMaterialModel.update({ subject: oldFagId }, { subject: newFagId });
            return;
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default new FagService();