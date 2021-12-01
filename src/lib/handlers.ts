import { DeleteResult, getConnection, Repository, UpdateResult } from "typeorm";
import { EntityTarget } from "typeorm/common/EntityTarget";
import {TPaginationResult} from "./types";

export class HandlersFactory<Entity> {
    private _repository: Repository<Entity>;

    constructor(public entity: EntityTarget<Entity>) {
        this._repository = getConnection().getRepository(entity);
    }

    // get all with filers and pagination
    public async getAll(filters: any, page: number, limit: number, hasPagination?: boolean): Promise<TPaginationResult<Entity[]> | Entity[]> {
        const [data, count] = await this._repository.findAndCount(
          Object.assign(
            {},
            filters,
            hasPagination && {
                skip: (page - 1) * limit,
                take: limit,
            }
          )
        );

        return hasPagination ?{
            total: count,
            page,
            limit,
            data,
        } : data;
    }

    // get one by id
    public async getOne(id: number): Promise<Entity> {
        return await this._repository.findOne(id);
    }

    // create new
    public async create(data: Entity): Promise<Entity> {
        return await this._repository.save(data);
    }

    // update by id
    public async update(id: number, data: Entity): Promise<UpdateResult> {
        return await this._repository.update(id, data);
    }

    // delete by id
    public async delete(id: number): Promise<DeleteResult> {
        return await this._repository.delete(id);
    }
}
