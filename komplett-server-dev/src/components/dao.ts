import * as _ from 'lodash';
import { Model, Mongoose, Types } from 'mongoose';
export interface paginationConfig {
    limit?: number;
    page?: number;
    order?: 'acs' | 'desc';
    sort?: string;
    matchField?: string;
    matchValue?: any;
    lookupAggregate?: Array<object>;
}
abstract class DAO {

    abstract model: Model<any>;
    /**
     * Get All data
     * @deprecated NEVER EVER load all entries from DB!
     * @return {object}
     */
    fnGetAll = <T>(): Promise<T[]> => {
        return new Promise((resolve, reject) => {
            this.model.find()
                .exec((err: any, docs: any) => {
                    if (err) {
                        console.error('DAO:fnGetAll() => find()', err);
                        reject(err);
                    }
                    resolve(docs);
                });
        });
    };

    /**
     * Get data by pagination,filter and sorting
     * @param {Number} limit -default is `10`
     * @param {Number} page -default is `1`
     * @param {'acs'|'desc'} order -can be 'acs' or 'desc', default is `acs`
     * @param {string} sort -sort field name default it is `createdAt`
     * @param {string} matchField -field name to use for searching
     * @param {string} matchValue -value to be compared
     * @param {Array<object>} lookupAggregate -lookup aggregation object
     */
    fnGetByConfigration = <T>(config: paginationConfig): Promise<any> => {
        let aggregation: any[] = [];

        const order = config.order && config.order == "desc" ? -1 : 1;
        const limit = config.limit || 10;
        const page = config.page || 1;
        const sort = config.sort || 'createdAt';
        const lookup = config.lookupAggregate;
        const skipNumber = (page - 1) * limit;

        // if any condition then match it first
        if (config.matchField && config.matchValue) {
            // const regEx= new RegExp(`${config.matchValue}` , 'i');
            const matchAggregate = { $match: { [config.matchField]: config.matchValue } };
            aggregation.push(matchAggregate);
        }

        const skipAggregate = { $skip: skipNumber };
        const sortAggregate = { $sort: { [sort]: order } };
        const limitAggregate = { $limit: limit };

        const facet = {
            '$facet': {
                metadata: [{ $count: "total" }, { $addFields: { page: page } }],
                data: [skipAggregate, limitAggregate]
            }
        };

        if (lookup) {
            aggregation.push(...lookup);
        }

        aggregation.push(sortAggregate, facet);

        // order 
        // 1. match
        // 2. lookup 
        // 2. sort 
        // 3. facet

        // console.log(aggregation)
        return new Promise((resolve, reject) => {
            this.model.aggregate(aggregation).then(result => {
                resolve(result[0]);
            }, error => {
                reject(error);
            })
        })
    }

    /**
     * Fetch one record from db
     *
     * @param {string} id.
     * @param {string} fields.
     * @return {object}
     */
    fnGet = <T>(id?: string, fields?: string): Promise<T> => {
        const _fields = fields || '';
        return new Promise((resolve, reject) => {
            this.model.findById({ _id: id }, _fields)
                .exec((err: any, obj: T | PromiseLike<T>) => {
                    if (err) {
                        console.error('DAO:fnGet() => findById()', err);
                        reject(err);
                    }
                    resolve(obj);
                });
        });
    };

    /**
     * Insert new record in db
     * @param {object}
     * @return {object}
     */
    insert = <T>(body?: object): Promise<T> => {
        return new Promise((resolve, reject) => {
            const obj = new this.model(body);
            obj.save((err: any, item: T | PromiseLike<T>) => {
                if (err) {
                    console.error('DAO:fnInsert() => save()', err);
                    reject(err);
                }
                resolve(item);
            });
        });
    };


    /**
     * Update record in db
     * @param {string} id.
     * @param {object} fields.
     * @return {object}
     */
    update = async <T>(id: string, fields?: object): Promise<T> => {
        try {
            const oid = Types.ObjectId(id);
            // console.log('this.model', this.model)
            const doc = await this.model.findOne({ _id: oid });
            // console.log(doc , 'it st the doc ')
            if (!doc) {
                throw new Error('doc not found with this id');
            }
            const updated = _.merge(doc, fields);
            return updated.save();
        } catch (error) {
            throw new Error(error.message);
        }
    };

    /**
     * Remove one record from db
     *
     * @param {string} id.
     * @return {number} number
     */
    deleteRecord = <T>(id?: string): Promise<T> => {
        return new Promise((resolve, reject) => {
            this.model.findOne({ _id: id }, (err: any, doc: any) => {
                if (!doc) {
                    reject('no document with this id')
                }
                if (err) {
                    reject(err);
                }
                if (doc) {
                    doc.remove();
                }
                resolve(doc);
            });
        });
    }

    /**
     * Count All data
     *
     * @return {number}
     */
    fnCount = () => {
        return new Promise((resolve, reject) => {
            this.model.countDocuments((err: any, count: any) => {
                if (err) {
                    console.error('DAO:fnCount() => count()', err);
                    reject(err);
                }
                resolve(count);
            });
        });
    }

}

export default DAO;
