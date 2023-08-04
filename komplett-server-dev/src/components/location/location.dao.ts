import { Model } from "mongoose";
import DAO from "../dao";
import LocationModel, { ILocationModel } from "./location.model";

class LocationDAO extends DAO {
    model: Model<any> = LocationModel;
}

export default new LocationDAO()