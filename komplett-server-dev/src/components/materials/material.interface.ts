import {
  IInsertSubMaterial,
  ISectionModel,
  IMaterialModel,
} from "./material.model";
import { Types } from "mongoose";
export interface IMaterialService {
  /**
   * @param {number} page
   * @param {number} limit no of results
   * @param {string} type can be from <tabTypes> enum
   * @param {string} sorting which field should be used for sorting
   */
  findAll(
    page: number,
    limit: number,
    order?: Number,
    type?: string,
    sorting?: string,
    division?: string
  ): Promise<ISectionModel[]>;
  /**
   * @param {ISectionModel} body
   */
  insert(body: ISectionModel): Promise<ISectionModel>;

  insertWithSubMaterials(body: any): Promise<ISectionModel>;

  pushInSubMaterials(body: any): Promise<ISectionModel>;

  /**
   * @param {string} id
   */
  remove(id: string): Promise<ISectionModel>;
  /**
   * @param {ISectionModel} body
   */
  update(body: ISectionModel): Promise<ISectionModel>;
  /**
   * @param {IInsertSubMaterial}  body
   */
  insetSubMaterial(body: IInsertSubMaterial): Promise<IMaterialModel>;
  /**
   * @param {string} id
   */
  findSubMaterial(id: string): Promise<IMaterialModel[]>;
  /**
   * @param {IMaterialModel} body
   */
  updateSubMaterial(body: IMaterialModel): Promise<IMaterialModel>;

  removeSubMaterial(id: string | Types.ObjectId): Promise<IMaterialModel>;

  clearAllQuantity(): Promise<ISectionModel>;

  reorderData(body: any): Promise<ISectionModel>;
}
