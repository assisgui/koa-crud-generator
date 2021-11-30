import {DeleteResult, getConnection, Repository, UpdateResult} from "typeorm";
import {EntityTarget} from "typeorm/common/EntityTarget";

export class HandlersFactory<t> {
    private _repository: Repository<t>;

    constructor(public entity: EntityTarget<t>) {
        this._repository = getConnection().getRepository(entity);
    }

    // get all with filers and pagination
    public async getAll(filters: any, page: number, limit: number, hasPagination?: boolean): Promise<t[]> {
        console.log('getAll');
        return await this._repository.find(
          Object.assign(
            {},
            filters,
            hasPagination && {
                skip: (page - 1) * limit,
                take: limit,
            }
          )
        );
    }

    // get one by id
    public async getOne(id: number): Promise<t> {
        console.log('getOne');
        return await this._repository.findOne(id);
    }

    // create new
    public async create(data: t): Promise<t> {
        return await this._repository.save(data);
    }

    // update by id
    public async update(id: number, data: t): Promise<UpdateResult> {
        return await this._repository.update(id, data);
    }

    // delete by id
    public async delete(id: number): Promise<DeleteResult> {
        return await this._repository.delete(id);
    }
}
